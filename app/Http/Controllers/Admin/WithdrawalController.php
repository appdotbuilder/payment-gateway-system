<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WithdrawalController extends Controller
{
    /**
     * Display withdrawal requests.
     */
    public function index(Request $request)
    {
        $withdrawals = WithdrawalRequest::with(['user', 'transaction'])
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/withdrawals/index', [
            'withdrawals' => $withdrawals,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Show withdrawal request details.
     */
    public function show(WithdrawalRequest $withdrawal)
    {
        $withdrawal->load(['user', 'transaction']);

        return Inertia::render('admin/withdrawals/show', [
            'withdrawal' => $withdrawal,
        ]);
    }

    /**
     * Approve withdrawal request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'withdrawal_id' => 'required|exists:withdrawal_requests,id',
            'action' => 'required|in:approve,reject',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $withdrawal = WithdrawalRequest::findOrFail($validated['withdrawal_id']);

        if ($withdrawal->status !== 'pending') {
            return back()->withErrors(['error' => 'This withdrawal request has already been processed.']);
        }

        DB::transaction(function () use ($withdrawal, $validated) {
            if ($validated['action'] === 'approve') {
                $withdrawal->update([
                    'status' => 'approved',
                    'admin_notes' => $validated['admin_notes'],
                    'approved_at' => now(),
                ]);

                $withdrawal->transaction->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
            } else {
                // Reject - refund the balance
                $withdrawal->user->wallet->increment('balance', (float) $withdrawal->amount);
                
                $withdrawal->update([
                    'status' => 'rejected',
                    'admin_notes' => $validated['admin_notes'],
                ]);

                $withdrawal->transaction->update([
                    'status' => 'failed',
                ]);
            }
        });

        $message = $validated['action'] === 'approve' 
            ? 'Withdrawal request approved successfully!'
            : 'Withdrawal request rejected and balance refunded.';

        return back()->with('success', $message);
    }
}