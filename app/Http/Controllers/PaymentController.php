<?php

namespace App\Http\Controllers;

use App\Http\Requests\TopUpRequest;
use App\Http\Requests\PaymentRequest;
use App\Http\Requests\WithdrawalRequest as WithdrawalFormRequest;
use App\Models\Merchant;
use App\Models\Transaction;
use App\Services\DanaPaymentService;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Wallet service instance.
     */
    private WalletService $walletService;

    /**
     * Dana payment service instance.
     */
    private DanaPaymentService $danaService;

    /**
     * Create a new controller instance.
     */
    public function __construct(WalletService $walletService, DanaPaymentService $danaService)
    {
        $this->walletService = $walletService;
        $this->danaService = $danaService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $wallet = $this->walletService->getOrCreateWallet($user);
        $merchants = Merchant::active()->get();

        return Inertia::render('payments/pay', [
            'wallet' => $wallet,
            'merchants' => $merchants,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        return Inertia::render('payments/topup', [
            'wallet' => $wallet,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TopUpRequest $request)
    {
        try {
            $user = auth()->user();
            $amount = $request->validated()['amount'];

            // Create transaction
            $transaction = $this->walletService->createTopUpTransaction($user, $amount);

            // Create payment with Dana
            $paymentResult = $this->danaService->createPayment($transaction);

            if ($paymentResult['success']) {
                return redirect($paymentResult['payment_url']);
            }

            return back()->withErrors(['amount' => 'Failed to process payment. Please try again.']);

        } catch (\Exception $e) {
            return back()->withErrors(['amount' => 'An error occurred while processing your request.']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        $user = auth()->user();
        $wallet = $this->walletService->getOrCreateWallet($user);

        return Inertia::render('payments/withdraw', [
            'wallet' => $wallet,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WithdrawalFormRequest $request)
    {
        try {
            $user = auth()->user();
            $validated = $request->validated();

            $bankDetails = [
                'bank_name' => $validated['bank_name'],
                'account_number' => $validated['account_number'],
                'account_holder_name' => $validated['account_holder_name'],
            ];

            $transaction = $this->walletService->createWithdrawalTransaction(
                $user,
                $validated['amount'],
                $bankDetails
            );

            return redirect()->route('dashboard')
                ->with('success', 'Withdrawal request submitted successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }

    /**
     * Process payment to merchant.
     */
    public function show(PaymentRequest $request)
    {
        try {
            $user = auth()->user();
            $validated = $request->validated();

            $transaction = $this->walletService->createPaymentTransaction(
                $user,
                $validated['amount'],
                $validated['merchant_id'],
                $validated['description']
            );

            return redirect()->route('dashboard')
                ->with('success', 'Payment completed successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()]);
        }
    }


}