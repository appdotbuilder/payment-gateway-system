<?php

namespace App\Http\Controllers;

use App\Services\WalletService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Wallet service instance.
     */
    private WalletService $walletService;

    /**
     * Create a new controller instance.
     */
    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Display the user dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        $wallet = $this->walletService->getOrCreateWallet($user);
        
        $recentTransactions = $user->transactions()
            ->with('merchant')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'wallet' => $wallet,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}