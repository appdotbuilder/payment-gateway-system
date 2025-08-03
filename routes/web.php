<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\WithdrawalController as AdminWithdrawalController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - Payment Gateway Dashboard
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

// Customer routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Payment routes
    Route::controller(PaymentController::class)->group(function () {
        Route::get('/topup', 'create')->name('topup.create');
        Route::post('/topup', 'store')->name('topup.store');
        Route::get('/pay', 'index')->name('payment.index');
        Route::post('/pay', 'show')->name('payment.show');
        Route::get('/withdraw', 'edit')->name('withdrawal.edit');
        Route::post('/withdraw', 'update')->name('withdrawal.update');
    });
    
    // Payment gateway webhooks
    Route::controller(WebhookController::class)->group(function () {
        Route::post('/payment/callback', 'store')->name('payment.callback');
        Route::get('/payment/success', 'show')->name('payment.success');
    });
    
    // Transaction routes
    Route::controller(TransactionController::class)->group(function () {
        Route::get('/transactions', 'index')->name('transactions.index');
        Route::get('/transactions/{transactionId}', 'show')->name('transactions.show');
    });
});

// Admin routes
Route::middleware(['auth', 'verified', App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Withdrawal management
    Route::controller(AdminWithdrawalController::class)->group(function () {
        Route::get('/withdrawals', 'index')->name('withdrawals.index');
        Route::get('/withdrawals/{withdrawal}', 'show')->name('withdrawals.show');
        Route::post('/withdrawals/process', 'store')->name('withdrawals.process');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';