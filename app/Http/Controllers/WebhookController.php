<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\DanaPaymentService;
use App\Services\WalletService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    /**
     * Dana payment service instance.
     */
    private DanaPaymentService $danaService;

    /**
     * Wallet service instance.
     */
    private WalletService $walletService;

    /**
     * Create a new controller instance.
     */
    public function __construct(DanaPaymentService $danaService, WalletService $walletService)
    {
        $this->danaService = $danaService;
        $this->walletService = $walletService;
    }

    /**
     * Handle payment callback from Dana.
     */
    public function store(Request $request)
    {
        $callbackData = $request->all();
        $result = $this->danaService->verifyCallback($callbackData);

        if ($result['success']) {
            $transaction = Transaction::where('transaction_id', $result['transaction_id'])->first();
            
            if ($transaction && $result['status'] === 'completed') {
                $this->walletService->completeTopUp($transaction);
            } elseif ($transaction) {
                $transaction->update(['status' => 'failed']);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Handle successful payment redirect.
     */
    public function show(Request $request)
    {
        return redirect()->route('dashboard')
            ->with('success', 'Top-up completed successfully!');
    }
}