<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display transaction history.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $transactions = $user->transactions()
            ->with(['merchant', 'withdrawalRequest'])
            ->when($request->type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    /**
     * Display transaction details.
     */
    public function show(string $transactionId)
    {
        $user = auth()->user();
        
        $transaction = $user->transactions()
            ->with(['merchant', 'withdrawalRequest'])
            ->where('transaction_id', $transactionId)
            ->firstOrFail();

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }
}