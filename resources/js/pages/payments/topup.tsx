import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { InputError } from '@/components/input-error';

interface Wallet {
    id: number;
    balance: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    wallet: Wallet;
    [key: string]: unknown;
}

export default function TopUp({ wallet }: Props) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
    });

    const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleQuickAmount = (amount: number) => {
        setSelectedAmount(amount);
        setData('amount', amount.toString());
    };

    const handleCustomAmount = (value: string) => {
        setSelectedAmount(null);
        setData('amount', value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('topup.store'));
    };

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
                        <h1 className="text-3xl font-bold text-gray-900">💰 Top Up Wallet</h1>
                        <p className="mt-2 text-gray-600">
                            Add money to your wallet using Dana payment gateway
                        </p>
                    </div>
                </div>

                {/* Current Balance */}
                <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardDescription className="text-green-100">
                                    Current Balance
                                </CardDescription>
                                <CardTitle className="text-3xl font-bold">
                                    {formatCurrency(parseFloat(wallet.balance))}
                                </CardTitle>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl">
                                <Wallet className="h-8 w-8" />
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Top-up Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                            Top Up via Dana
                        </CardTitle>
                        <CardDescription>
                            Select amount to add to your wallet
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Quick Amount Selection */}
                            <div className="space-y-3">
                                <Label>Quick Amount Selection</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {quickAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            type="button"
                                            variant={selectedAmount === amount ? "default" : "outline"}
                                            className="h-12 text-sm"
                                            onClick={() => handleQuickAmount(amount)}
                                        >
                                            {formatCurrency(amount)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount Input */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">Custom Amount (IDR)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount (min. 10,000)"
                                    value={data.amount}
                                    onChange={(e) => handleCustomAmount(e.target.value)}
                                    min="10000"
                                    max="10000000"
                                    className="text-lg"
                                />
                                <InputError message={errors.amount} />
                                <p className="text-sm text-gray-500">
                                    Minimum: Rp 10,000 • Maximum: Rp 10,000,000
                                </p>
                            </div>

                            {/* Payment Method Info */}
                            <Alert>
                                <CreditCard className="h-4 w-4" />
                                <AlertDescription>
                                    You will be redirected to Dana payment gateway to complete your top-up. 
                                    This is a secure sandbox environment for testing.
                                </AlertDescription>
                            </Alert>

                            {/* Summary */}
                            {data.amount && parseFloat(data.amount) >= 10000 && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Top-up Amount:</span>
                                        <span className="font-medium">
                                            {formatCurrency(parseFloat(data.amount))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">New Balance:</span>
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(parseFloat(wallet.balance) + parseFloat(data.amount))}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                size="lg"
                                disabled={processing || !data.amount || parseFloat(data.amount) < 10000}
                            >
                                {processing ? 'Processing...' : 'Proceed to Dana Payment'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-700">
                                🔒 Secure Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                All transactions are processed through Dana's secure payment gateway 
                                with end-to-end encryption.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-700">
                                ⚡ Instant Processing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Your wallet balance will be updated immediately after successful 
                                payment confirmation.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}