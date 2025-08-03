<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MerchantSeeder::class,
        ]);

        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@paygate.com',
            'role' => 'admin',
        ]);

        // Create test customer
        User::factory()->create([
            'name' => 'Test Customer',
            'email' => 'customer@paygate.com',
            'role' => 'customer',
        ]);
    }
}
