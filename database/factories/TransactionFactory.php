<?php

namespace Database\Factories;

use App\Models\Merchant;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Transaction>
     */
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['topup', 'payment', 'withdrawal']);
        
        return [
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)) . '-' . time(),
            'user_id' => User::factory(),
            'type' => $type,
            'amount' => $this->faker->randomFloat(2, 10000, 1000000),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed', 'cancelled']),
            'gateway' => $type === 'topup' ? 'dana' : null,
            'gateway_transaction_id' => $type === 'topup' ? 'DANA-' . Str::random(16) : null,
            'merchant_id' => $type === 'payment' ? Merchant::factory() : null,
            'description' => $this->faker->sentence(),
            'metadata' => $type === 'topup' ? [
                'dana_payment_url' => $this->faker->url(),
                'dana_response' => ['status' => 'success'],
            ] : null,
            'completed_at' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Indicate that the transaction is a top-up.
     */
    public function topup(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'topup',
            'gateway' => 'dana',
            'gateway_transaction_id' => 'DANA-' . Str::random(16),
            'merchant_id' => null,
            'metadata' => [
                'dana_payment_url' => $this->faker->url(),
                'dana_response' => ['status' => 'success'],
            ],
        ]);
    }

    /**
     * Indicate that the transaction is a payment.
     */
    public function payment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'payment',
            'gateway' => null,
            'gateway_transaction_id' => null,
            'merchant_id' => Merchant::factory(),
            'metadata' => null,
        ]);
    }

    /**
     * Indicate that the transaction is a withdrawal.
     */
    public function withdrawal(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'withdrawal',
            'gateway' => null,
            'gateway_transaction_id' => null,
            'merchant_id' => null,
            'metadata' => null,
        ]);
    }

    /**
     * Indicate that the transaction is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}