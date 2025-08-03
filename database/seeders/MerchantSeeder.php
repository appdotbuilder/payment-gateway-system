<?php

namespace Database\Seeders;

use App\Models\Merchant;
use Illuminate\Database\Seeder;

class MerchantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $merchants = [
            [
                'name' => 'Shopee',
                'code' => 'SHOPEE',
                'description' => 'E-commerce marketplace',
                'logo_url' => '/images/merchants/shopee.png',
                'status' => 'active',
            ],
            [
                'name' => 'Tokopedia',
                'code' => 'TOKOPEDIA',
                'description' => 'Online marketplace',
                'logo_url' => '/images/merchants/tokopedia.png',
                'status' => 'active',
            ],
            [
                'name' => 'Grab',
                'code' => 'GRAB',
                'description' => 'Ride-hailing and food delivery',
                'logo_url' => '/images/merchants/grab.png',
                'status' => 'active',
            ],
            [
                'name' => 'Gojek',
                'code' => 'GOJEK',
                'description' => 'Multi-service platform',
                'logo_url' => '/images/merchants/gojek.png',
                'status' => 'active',
            ],
            [
                'name' => 'Blibli',
                'code' => 'BLIBLI',
                'description' => 'Online shopping platform',
                'logo_url' => '/images/merchants/blibli.png',
                'status' => 'active',
            ],
        ];

        foreach ($merchants as $merchant) {
            Merchant::create($merchant);
        }
    }
}