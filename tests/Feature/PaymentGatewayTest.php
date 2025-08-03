<?php

use App\Models\Merchant;
use App\Models\User;
use App\Models\Wallet;
use App\Services\WalletService;

test('user can view dashboard with wallet balance', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 100000]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('dashboard')
            ->has('wallet')
            ->where('wallet.balance', '100000.00')
    );
});

test('user can view top-up page', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get('/topup');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('payments/topup')
            ->has('wallet')
    );
});

test('user can view payment page with merchants', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id]);
    $merchants = Merchant::factory()->count(3)->active()->create();

    $response = $this->actingAs($user)->get('/pay');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('payments/pay')
            ->has('wallet')
            ->has('merchants', 3)
    );
});

test('user can make payment to merchant', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 100000]);
    $merchant = Merchant::factory()->active()->create();

    $response = $this->actingAs($user)->post('/pay', [
        'amount' => 50000,
        'merchant_id' => $merchant->id,
        'description' => 'Test payment',
    ]);

    $response->assertRedirect('/dashboard');
    $response->assertSessionHas('success');

    // Check wallet balance was deducted
    $wallet->refresh();
    expect($wallet->balance)->toBe('50000.00');

    // Check transaction was created
    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'type' => 'payment',
        'amount' => 50000,
        'merchant_id' => $merchant->id,
        'status' => 'completed',
    ]);
});

test('user cannot make payment with insufficient balance', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 10000]);
    $merchant = Merchant::factory()->active()->create();

    $response = $this->actingAs($user)->post('/pay', [
        'amount' => 50000,
        'merchant_id' => $merchant->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors();

    // Check wallet balance unchanged
    $wallet->refresh();
    expect($wallet->balance)->toBe('10000.00');
});

test('user can request withdrawal', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 200000]);

    $response = $this->actingAs($user)->post('/withdraw', [
        'amount' => 100000,
        'bank_name' => 'BCA',
        'account_number' => '1234567890',
        'account_holder_name' => 'John Doe',
    ]);

    $response->assertRedirect('/dashboard');
    $response->assertSessionHas('success');

    // Check wallet balance was deducted
    $wallet->refresh();
    expect($wallet->balance)->toBe('100000.00');

    // Check withdrawal request was created
    $this->assertDatabaseHas('withdrawal_requests', [
        'user_id' => $user->id,
        'amount' => 100000,
        'bank_name' => 'BCA',
        'account_number' => '1234567890',
        'status' => 'pending',
    ]);

    // Check transaction was created
    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'type' => 'withdrawal',
        'amount' => 100000,
        'status' => 'pending',
    ]);
});

test('admin can view dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('admin/dashboard')
            ->has('stats')
    );
});

test('customer cannot access admin dashboard', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $response = $this->actingAs($customer)->get('/admin/dashboard');

    $response->assertStatus(403);
});

test('wallet service creates top-up transaction', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $walletService = app(WalletService::class);

    $transaction = $walletService->createTopUpTransaction($user, 100000, 'Test top-up');

    expect($transaction->user_id)->toBe($user->id);
    expect($transaction->type)->toBe('topup');
    expect($transaction->amount)->toBe('100000.00');
    expect($transaction->status)->toBe('pending');
    expect($transaction->gateway)->toBe('dana');
});

test('wallet service completes top-up transaction', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $wallet = Wallet::factory()->create(['user_id' => $user->id, 'balance' => 50000]);
    $walletService = app(WalletService::class);

    $transaction = $walletService->createTopUpTransaction($user, 100000);
    $walletService->completeTopUp($transaction);

    $transaction->refresh();
    $wallet->refresh();

    expect($transaction->status)->toBe('completed');
    expect($wallet->balance)->toBe('150000.00');
});