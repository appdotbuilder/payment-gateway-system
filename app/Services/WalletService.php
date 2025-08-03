<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WalletService
{
    /**
     * Get or create a wallet for the user
     */
    public function getOrCreateWallet(User $user): Wallet
    {
        $wallet = $user->wallet;
        if ($wallet instanceof Wallet) {
            return $wallet;
        }
        
        /** @var Wallet */
        return $user->wallet()->create(['balance' => 0]);
    }

    /**
     * Create a top-up transaction
     */
    public function createTopUpTransaction(User $user, float $amount, string $description = null): Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            return Transaction::create([
                'transaction_id' => $this->generateTransactionId(),
                'user_id' => $user->id,
                'type' => 'topup',
                'amount' => $amount,
                'status' => 'pending',
                'gateway' => 'dana',
                'description' => $description ?? 'Wallet Top-up',
            ]);
        });
    }

    /**
     * Create a payment transaction
     */
    public function createPaymentTransaction(User $user, float $amount, int $merchantId, string $description = null): Transaction
    {
        $wallet = $this->getOrCreateWallet($user);

        if ($wallet->balance < $amount) {
            throw new \Exception('Insufficient balance');
        }

        return DB::transaction(function () use ($user, $amount, $merchantId, $description, $wallet) {
            // Deduct from wallet
            $wallet->decrement('balance', $amount);

            // Create transaction
            return Transaction::create([
                'transaction_id' => $this->generateTransactionId(),
                'user_id' => $user->id,
                'type' => 'payment',
                'amount' => $amount,
                'status' => 'completed',
                'merchant_id' => $merchantId,
                'description' => $description ?? 'Payment to merchant',
                'completed_at' => now(),
            ]);
        });
    }

    /**
     * Create a withdrawal transaction
     */
    public function createWithdrawalTransaction(User $user, float $amount, array $bankDetails): Transaction
    {
        $wallet = $this->getOrCreateWallet($user);

        if ($wallet->balance < $amount) {
            throw new \Exception('Insufficient balance');
        }

        return DB::transaction(function () use ($user, $amount, $bankDetails, $wallet) {
            // Deduct from wallet
            $wallet->decrement('balance', $amount);

            // Create transaction
            $transaction = Transaction::create([
                'transaction_id' => $this->generateTransactionId(),
                'user_id' => $user->id,
                'type' => 'withdrawal',
                'amount' => $amount,
                'status' => 'pending',
                'description' => 'Withdrawal request',
            ]);

            // Create withdrawal request
            $transaction->withdrawalRequest()->create([
                'user_id' => $user->id,
                'amount' => $amount,
                'bank_name' => $bankDetails['bank_name'],
                'account_number' => $bankDetails['account_number'],
                'account_holder_name' => $bankDetails['account_holder_name'],
                'status' => 'pending',
            ]);

            return $transaction;
        });
    }

    /**
     * Complete a top-up transaction
     */
    public function completeTopUp(Transaction $transaction): void
    {
        if ($transaction->type !== 'topup' || $transaction->status !== 'pending') {
            throw new \Exception('Invalid transaction for top-up completion');
        }

        DB::transaction(function () use ($transaction) {
            $wallet = $this->getOrCreateWallet($transaction->user);
            $wallet->increment('balance', (float) $transaction->amount);

            $transaction->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        });
    }

    /**
     * Generate a unique transaction ID
     */
    public function generateTransactionId(): string
    {
        return 'TXN-' . strtoupper(Str::random(12)) . '-' . time();
    }
}