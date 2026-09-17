<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameTransaction;
use App\Models\LiveCommunityWin;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GgrGoldApiController extends Controller
{
    /**
     * Handle incoming Seamless Wallet Webhook callbacks from NexusGGR.
     */
    public function handle(Request $request): JsonResponse
    {
        Log::info('GGR Gold API Webhook Request:', [
            'method' => $request->input('method'),
            'user_code' => $request->input('user_code'),
            'agent_code' => $request->input('agent_code'),
            'body' => $request->all(),
        ]);

        $secret = $request->header('Agent-Secret')
            ?? $request->header('agent_secret')
            ?? $request->header('X-Agent-Secret')
            ?? $request->input('agent_secret')
            ?? $request->input('agentSecret');

        $expectedSecret = config('services.nexus_ggr.agent_secret');
        if (empty($expectedSecret)) {
            $expectedSecret = config('services.nexus.agent_secret');
        }
        if (empty($expectedSecret)) {
            $expectedSecret = env('GGR_AGENT_SECRET');
        }

        if (! empty($expectedSecret) && $secret !== $expectedSecret) {
            Log::warning('GGR Gold API invalid secret:', ['received' => $secret, 'expected' => $expectedSecret]);

            return response()->json([
                'status' => 0,
                'user_balance' => 0,
                'msg' => 'INVALID_SECRET',
            ], 200);
        }

        $method = $request->input('method') ?? $request->input('action');

        return match ($method) {
            'user_balance', 'user_balance_v2', 'userBalance' => $this->handleUserBalance($request),
            'transaction', 'transaction_v2', 'debit_credit' => $this->handleTransaction($request),
            default => response()->json([
                'status' => 0,
                'user_balance' => 0,
                'msg' => 'INVALID_METHOD',
            ], 200),
        };
    }

    /**
     * Method: user_balance
     */
    protected function handleUserBalance(Request $request): JsonResponse
    {
        $userCode = $request->input('user_code') ?? $request->input('user_id');

        if (empty($userCode)) {
            return response()->json([
                'status' => 0,
                'user_balance' => 0,
                'msg' => 'INTERNAL_ERROR',
            ], 200);
        }

        $user = User::where('user_code', $userCode)
            ->orWhere('id', $userCode)
            ->first();

        if (! $user || $user->is_banned) {
            return response()->json([
                'status' => 0,
                'user_balance' => 0,
                'msg' => 'INTERNAL_ERROR',
            ], 200);
        }

        return response()->json([
            'status' => 1,
            'user_balance' => (float) round((float) $user->game_balance, 2),
        ], 200);
    }

    /**
     * Method: transaction
     */
    protected function handleTransaction(Request $request): JsonResponse
    {
        $userCode = $request->input('user_code') ?? $request->input('user_id');
        $txnId = $request->input('txn_id');
        $txnIdV2 = $request->input('txn_id_v2') ?? $txnId;
        $txnType = $request->input('txn_type', 'debit_credit');
        $roundId = $request->input('round_id');
        $gameCode = $request->input('game_code');

        // Extract nested bet_money & win_money from slot, live, SB, MN, or FT objects
        $betMoney = 0.00;
        $winMoney = 0.00;

        foreach (['slot', 'live', 'SB', 'MN', 'FT'] as $key) {
            if ($request->has($key) && is_array($request->input($key))) {
                $subData = $request->input($key);
                $betMoney += (float) ($subData['bet_money'] ?? $subData['bet'] ?? 0);
                $winMoney += (float) ($subData['win_money'] ?? $subData['win'] ?? 0);
                if (empty($txnIdV2) && ! empty($subData['txn_id_v2'])) {
                    $txnIdV2 = $subData['txn_id_v2'];
                }
                if (empty($txnId) && ! empty($subData['txn_id'])) {
                    $txnId = $subData['txn_id'];
                }
                if (empty($roundId) && ! empty($subData['round_id'])) {
                    $roundId = $subData['round_id'];
                }
                if (empty($gameCode) && ! empty($subData['game_code'])) {
                    $gameCode = $subData['game_code'];
                }
            }
        }

        if ($betMoney == 0.00 && $request->has('bet_money')) {
            $betMoney = (float) $request->input('bet_money');
        }
        if ($winMoney == 0.00 && $request->has('win_money')) {
            $winMoney = (float) $request->input('win_money');
        }

        $txnIdV2 = $txnIdV2 ?: ($txnId ?: Str::uuid()->toString());

        // 1. Deduplicate strictly on txn_id_v2
        $existingTx = GameTransaction::where('txn_id_v2', $txnIdV2)->first();

        if ($existingTx) {
            return response()->json([
                'status' => 1,
                'user_balance' => (float) $existingTx->after_balance,
                'msg' => 'DUPLICATE_TRANSACTION_SKIPPED',
            ], 200);
        }

        // 2. Atomic DB Transaction with Pessimistic Row Lock
        try {
            return DB::transaction(function () use ($userCode, $txnId, $txnIdV2, $txnType, $roundId, $gameCode, $betMoney, $winMoney, $request) {
                $user = User::where('user_code', $userCode)
                    ->orWhere('id', $userCode)
                    ->lockForUpdate()
                    ->first();

                if (! $user || $user->is_banned) {
                    return response()->json([
                        'status' => 0,
                        'user_balance' => 0.00,
                        'msg' => 'INTERNAL_ERROR',
                    ], 200);
                }

                $beforeBalance = (float) $user->game_balance;

                if ($beforeBalance < $betMoney) {
                    return response()->json([
                        'status' => 0,
                        'user_balance' => $beforeBalance,
                        'msg' => 'INSUFFICIENT_USER_FUNDS',
                    ], 200);
                }

                $afterBalance = round($beforeBalance - $betMoney + $winMoney, 2);
                $user->game_balance = $afterBalance;
                $user->save();

                $game = Game::where('game_code', $gameCode)->first();
                if ($game) {
                    $game->increment('play_count');
                }

                // 3. Create Audit Log
                GameTransaction::create([
                    'user_id' => $user->id,
                    'game_id' => $game?->id,
                    'user_code' => $userCode,
                    'txn_id' => $txnId ?? Str::uuid()->toString(),
                    'txn_id_v2' => $txnIdV2 ?? Str::uuid()->toString(),
                    'txn_type' => $txnType,
                    'round_id' => $roundId,
                    'bet_amount' => $betMoney,
                    'win_amount' => $winMoney,
                    'before_balance' => $beforeBalance,
                    'after_balance' => $afterBalance,
                    'raw_payload' => $request->all(),
                    'created_at' => now(),
                ]);

                // 4. Community Big Win Broadcaster (Win >= 20.00 SC)
                if ($winMoney >= 20.00) {
                    $multiplier = $betMoney > 0 ? round($winMoney / $betMoney, 2) : 1.0;
                    LiveCommunityWin::create([
                        'user_id' => $user->id,
                        'user_code' => $user->user_code,
                        'game_name' => $game?->name ?? $gameCode ?? 'Pragmatic Slot',
                        'bet_amount' => $betMoney,
                        'win_amount' => $winMoney,
                        'multiplier' => $multiplier,
                        'created_at' => now(),
                    ]);
                }

                return response()->json([
                    'status' => 1,
                    'user_balance' => $afterBalance,
                    'msg' => 'SUCCESS',
                ], 200);
            });
        } catch (\Exception $e) {
            Log::error('NexusGGR Transaction Exception: '.$e->getMessage());

            return response()->json([
                'status' => 0,
                'user_balance' => 0.00,
                'msg' => 'INTERNAL_ERROR',
            ], 200);
        }
    }
}
