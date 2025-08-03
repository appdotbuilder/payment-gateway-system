import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Store, Wallet, AlertCircle } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { InputError } from '@/components/input-error';

interface Merchant {
    id: number;
    name: string;
    code: string;
    description: string;
    logo_url: string;
    status: string;
}

interface Wallet {
    id: number;
    balance: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    wallet: Wallet;
    merchants: Merchant[];
    [key: string]: unknown;
}

export default function Pay({ wallet, merchants }: Props) {
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        merchant_id: '',
        description: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleMerchantSelect = (merchant: Merchant) => {
        setSelectedMerchant(merchant);
        setData('merchant_id', merchant.id.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payment.show'));
    };

    const walletBalance = parseFloat(wallet.balance);
    const paymentAmount = parseFloat(data.amount) || 0;
    const insufficientBalance = paymentAmount > walletBalance;

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">💳 Pay Merchant</h1>
                        <p className="mt-2 text-gray-600">
                            Pay to your favorite merchants using your wallet balance
                        </p>
                    </div>
                </div>

                {/* Current Balance */}
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardDescription className="text-blue-100">
                                    Available Balance
                                </CardDescription>
                                <CardTitle className="text-3xl font-bold">
                                    {formatCurrency(walletBalance)}
                                </CardTitle>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl">
                                <Wallet className="h-8 w-8" />
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Merchant Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="h-5 w-5 mr-2 text-blue-600" />
                            Select Merchant
                        </CardTitle>
                        <CardDescription>
                            Choose the merchant you want to pay
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {merchants.map((merchant) => (
                                <Card
                                    key={merchant.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedMerchant?.id === merchant.id
                                            ? 'ring-2 ring-blue-500 border-blue-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleMerchantSelect(merchant)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Store className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {merchant.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {merchant.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <InputError message={errors.merchant_id} />
                    </CardContent>
                </Card>

                {/* Payment Form */}
                {selectedMerchant && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Send className="h-5 w-5 mr-2 text-green-600" />
                                Payment Details
                            </CardTitle>
                            <CardDescription>
                                Enter payment amount for {selectedMerchant.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Payment Amount (IDR)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter amount (min. 1,000)"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        min="1000"
                                        className="text-lg"
                                    />
                                    <InputError message={errors.amount} />
                                    <p className="text-sm text-gray-500">
                                        Minimum payment: Rp 1,000
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Add a note for this payment"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Insufficient Balance Warning */}
                                {insufficientBalance && paymentAmount > 0 && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-700">
                                            Insufficient balance. You need {formatCurrency(paymentAmount - walletBalance)} more.
                                            <Link href="/topup" className="ml-2 underline font-medium">
                                                Top up now
                                            </Link>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Payment Summary */}
                                {data.amount && parseFloat(data.amount) >= 1000 && !insufficientBalance && (
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Merchant:</span>
                                            <span className="font-medium">{selectedMerchant.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Payment Amount:</span>
                                            <span className="font-medium">
                                                {formatCurrency(paymentAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Remaining Balance:</span>
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(walletBalance - paymentAmount)}
                                            </span>
                                        </div>
                                        {data.description && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Note:</span>
                                                <span className="font-medium italic">"{data.description}"</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    size="lg"
                                    disabled={
                                        processing || 
                                        !data.amount || 
                                        parseFloat(data.amount) < 1000 || 
                                        insufficientBalance
                                    }
                                >
                                    {processing ? 'Processing Payment...' : `Pay ${formatCurrency(paymentAmount)}`}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Info Card */}
                <Card className="border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-700">
                            💡 Payment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Payments are processed instantly from your wallet balance</li>
                            <li>• Transaction history is available in your dashboard</li>
                            <li>• All payments are secure and encrypted</li>
                            <li>• Contact support if you have any issues</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}