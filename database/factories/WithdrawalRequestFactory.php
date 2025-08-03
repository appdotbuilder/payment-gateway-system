<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use App\Models\WithdrawalRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WithdrawalRequest>
 */
class WithdrawalRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\WithdrawalRequest>
     */
    protected $model = WithdrawalRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $banks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Danamon'];
        
        return [
            'user_id' => User::factory(),
            'transaction_id' => Transaction::factory(),
            'amount' => $this->faker->randomFloat(2, 50000, 5000000),
            'bank_name' => $this->faker->randomElement($banks),
            'account_number' => $this->faker->numerify('##########'),
            'account_holder_name' => $this->faker->name(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'admin_notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
            'approved_at' => $this->faker->boolean(40) ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
        ];
    }

    /**
     * Indicate that the withdrawal request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'admin_notes' => null,
            'approved_at' => null,
        ]);
    }

    /**
     * Indicate that the withdrawal request is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'admin_notes' => 'Approved by admin',
            'approved_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}