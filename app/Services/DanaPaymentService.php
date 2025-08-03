<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DanaPaymentService
{
    /**
     * Dana API base URL.
     */
    private string $baseUrl;

    /**
     * Dana merchant ID.
     */
    private string $merchantId;

    /**
     * Dana API key.
     */
    private string $apiKey;

    /**
     * Create a new Dana payment service instance.
     */
    public function __construct()
    {
        $this->baseUrl = config('services.dana.base_url', 'https://sandbox.dana.id/api/v1');
        $this->merchantId = config('services.dana.merchant_id', 'sandbox_merchant');
        $this->apiKey = config('services.dana.api_key', 'sandbox_api_key');
    }

    /**
     * Create a payment request with Dana
     */
    public function createPayment(Transaction $transaction): array
    {
        try {
            $payload = [
                'merchantId' => $this->merchantId,
                'transactionId' => $transaction->transaction_id,
                'amount' => $transaction->amount,
                'currency' => 'IDR',
                'description' => $transaction->description ?? 'Wallet Top-up',
                'callbackUrl' => route('payment.callback'),
                'redirectUrl' => route('payment.success'),
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/payments', $payload);

            if ($response->successful()) {
                $data = $response->json();
                
                // Update transaction with gateway details
                $transaction->update([
                    'gateway_transaction_id' => $data['gatewayTransactionId'] ?? null,
                    'metadata' => array_merge($transaction->metadata ?? [], [
                        'dana_payment_url' => $data['paymentUrl'] ?? null,
                        'dana_response' => $data,
                    ]),
                ]);

                return [
                    'success' => true,
                    'payment_url' => $data['paymentUrl'] ?? null,
                    'gateway_transaction_id' => $data['gatewayTransactionId'] ?? null,
                ];
            }

            Log::error('Dana payment creation failed', [
                'transaction_id' => $transaction->transaction_id,
                'response' => $response->json(),
            ]);

            return [
                'success' => false,
                'error' => 'Failed to create payment with Dana',
            ];

        } catch (\Exception $e) {
            Log::error('Dana payment service error', [
                'transaction_id' => $transaction->transaction_id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Payment service unavailable',
            ];
        }
    }

    /**
     * Verify payment callback from Dana
     */
    public function verifyCallback(array $callbackData): array
    {
        // In a real implementation, you would verify the signature
        // For sandbox, we'll simulate the verification
        
        $transactionId = $callbackData['transactionId'] ?? null;
        $status = $callbackData['status'] ?? 'failed';
        $gatewayTransactionId = $callbackData['gatewayTransactionId'] ?? null;

        if (!$transactionId) {
            return [
                'success' => false,
                'error' => 'Missing transaction ID',
            ];
        }

        return [
            'success' => true,
            'transaction_id' => $transactionId,
            'status' => $status === 'success' ? 'completed' : 'failed',
            'gateway_transaction_id' => $gatewayTransactionId,
        ];
    }
}