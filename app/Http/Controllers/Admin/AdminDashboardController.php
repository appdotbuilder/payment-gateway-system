<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\WithdrawalRequest;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $totalUsers = User::where('role', 'customer')->count();
        $totalTransactions = Transaction::count();
        $pendingWithdrawals = WithdrawalRequest::pending()->count();
        $totalVolume = Transaction::where('status', 'completed')->sum('amount');

        $recentTransactions = Transaction::with(['user', 'merchant'])
            ->latest()
            ->limit(10)
            ->get();

        $pendingWithdrawalRequests = WithdrawalRequest::with('user')
            ->pending()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalTransactions' => $totalTransactions,
                'pendingWithdrawals' => $pendingWithdrawals,
                'totalVolume' => $totalVolume,
            ],
            'recentTransactions' => $recentTransactions,
            'pendingWithdrawals' => $pendingWithdrawalRequests,
        ]);
    }
}