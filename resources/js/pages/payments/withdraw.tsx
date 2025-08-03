import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowDownCircle, Wallet, AlertCircle, Building2 } from 'lucide-react';
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

export default function Withdraw({ wallet }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        bank_name: '',
        account_number: '',
        account_holder_name: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('withdrawal.update'));
    };

    const walletBalance = parseFloat(wallet.balance);
    const withdrawalAmount = parseFloat(data.amount) || 0;
    const insufficientBalance = withdrawalAmount > walletBalance;

    const popularBanks = [
        'BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 
        'Danamon', 'Permata', 'OCBC NISP', 'Maybank'
    ];

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
                        <h1 className="text-3xl font-bold text-gray-900">💸 Withdraw Funds</h1>
                        <p className="mt-2 text-gray-600">
                            Transfer money from your wallet to your bank account
                        </p>
                    </div>
                </div>

                {/* Current Balance */}
                <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardDescription className="text-orange-100">
                                    Available for Withdrawal
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

                {/* Withdrawal Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ArrowDownCircle className="h-5 w-5 mr-2 text-orange-600" />
                            Withdrawal Request
                        </CardTitle>
                        <CardDescription>
                            Enter your bank details and withdrawal amount
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Amount Input */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">Withdrawal Amount (IDR)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount (min. 50,000)"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    min="50000"
                                    className="text-lg"
                                />
                                <InputError message={errors.amount} />
                                <p className="text-sm text-gray-500">
                                    Minimum withdrawal: Rp 50,000
                                </p>
                            </div>

                            {/* Bank Details Section */}
                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="h-5 w-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">Bank Account Details</h3>
                                </div>

                                {/* Bank Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="bank_name">Bank Name</Label>
                                    <Input
                                        id="bank_name"
                                        placeholder="e.g., Bank Central Asia (BCA)"
                                        value={data.bank_name}
                                        onChange={(e) => setData('bank_name', e.target.value)}
                                        list="banks"
                                    />
                                    <datalist id="banks">
                                        {popularBanks.map((bank) => (
                                            <option key={bank} value={bank} />
                                        ))}
                                    </datalist>
                                    <InputError message={errors.bank_name} />
                                </div>

                                {/* Account Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="account_number">Account Number</Label>
                                    <Input
                                        id="account_number"
                                        placeholder="Enter your account number"
                                        value={data.account_number}
                                        onChange={(e) => setData('account_number', e.target.value)}
                                    />
                                    <InputError message={errors.account_number} />
                                </div>

                                {/* Account Holder Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="account_holder_name">Account Holder Name</Label>
                                    <Input
                                        id="account_holder_name"
                                        placeholder="Full name as registered in bank"
                                        value={data.account_holder_name}
                                        onChange={(e) => setData('account_holder_name', e.target.value)}
                                    />
                                    <InputError message={errors.account_holder_name} />
                                    <p className="text-sm text-gray-500">
                                        Must match exactly with your bank account
                                    </p>
                                </div>
                            </div>

                            {/* Insufficient Balance Warning */}
                            {insufficientBalance && withdrawalAmount > 0 && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-700">
                                        Insufficient balance. You can withdraw up to {formatCurrency(walletBalance)}.
                                        <Link href="/topup" className="ml-2 underline font-medium">
                                            Top up your wallet
                                        </Link>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Withdrawal Summary */}
                            {data.amount && parseFloat(data.amount) >= 50000 && !insufficientBalance && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Withdrawal Amount:</span>
                                        <span className="font-medium">
                                            {formatCurrency(withdrawalAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Processing Fee:</span>
                                        <span className="font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">You'll Receive:</span>
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(withdrawalAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Remaining Balance:</span>
                                        <span className="font-semibold">
                                            {formatCurrency(walletBalance - withdrawalAmount)}
                                        </span>
                                    </div>
                                    {data.bank_name && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Destination:</span>
                                            <span className="font-medium">
                                                {data.bank_name}
                                                {data.account_number && ` - ${data.account_number}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700"
                                size="lg"
                                disabled={
                                    processing || 
                                    !data.amount || 
                                    parseFloat(data.amount) < 50000 || 
                                    insufficientBalance ||
                                    !data.bank_name ||
                                    !data.account_number ||
                                    !data.account_holder_name
                                }
                            >
                                {processing ? 'Submitting Request...' : 'Submit Withdrawal Request'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Important Information */}
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                        <strong>Important:</strong> Withdrawal requests require admin approval. 
                        Processing time is typically 1-3 business days. Your wallet balance will be 
                        deducted immediately upon submission.
                    </AlertDescription>
                </Alert>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-blue-700">
                                ⏱️ Processing Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Withdrawal requests are processed within 1-3 business days 
                                after admin approval.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-700">
                                💰 No Processing Fee
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                We don't charge any processing fees for withdrawals. 
                                You receive the full amount.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}