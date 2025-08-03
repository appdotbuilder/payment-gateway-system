import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowUpCircle, 
    ArrowDownCircle, 
    CreditCard, 
    History, 
    Plus,
    Send,
    Wallet,
    TrendingUp
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Transaction {
    id: number;
    transaction_id: string;
    type: 'topup' | 'payment' | 'withdrawal';
    amount: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    created_at: string;
    merchant?: {
        name: string;
    };
}

interface Wallet {
    id: number;
    balance: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    wallet: Wallet;
    recentTransactions: Transaction[];
    [key: string]: unknown;
}

export default function Dashboard({ wallet, recentTransactions }: Props) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(parseFloat(amount));
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'topup':
                return <ArrowUpCircle className="h-4 w-4 text-green-600" />;
            case 'payment':
                return <Send className="h-4 w-4 text-blue-600" />;
            case 'withdrawal':
                return <ArrowDownCircle className="h-4 w-4 text-orange-600" />;
            default:
                return <CreditCard className="h-4 w-4" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            completed: 'default',
            pending: 'secondary',
            failed: 'destructive',
            cancelled: 'outline',
        };

        return (
            <Badge variant={variants[status] || 'outline'} className="capitalize">
                {status}
            </Badge>
        );
    };

    const getTransactionDescription = (transaction: Transaction) => {
        switch (transaction.type) {
            case 'topup':
                return 'Wallet Top-up via Dana';
            case 'payment':
                return transaction.merchant ? `Payment to ${transaction.merchant.name}` : 'Merchant Payment';
            case 'withdrawal':
                return 'Withdrawal Request';
            default:
                return 'Transaction';
        }
    };

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">💳 Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your digital wallet and view transaction history
                    </p>
                </div>

                {/* Wallet Balance Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardDescription className="text-blue-100">
                                    Your Wallet Balance
                                </CardDescription>
                                <CardTitle className="text-4xl font-bold">
                                    {formatCurrency(wallet.balance)}
                                </CardTitle>
                            </div>
                            <div className="p-3 bg-white/20 rounded-2xl">
                                <Wallet className="h-8 w-8" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center text-sm text-blue-100">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Available for payments and withdrawals
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/topup">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-300">
                            <CardHeader className="text-center">
                                <div className="mx-auto p-3 bg-green-100 rounded-2xl w-fit">
                                    <Plus className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-lg text-green-700">Top Up</CardTitle>
                                <CardDescription>
                                    Add money to your wallet via Dana
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/pay">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-300">
                            <CardHeader className="text-center">
                                <div className="mx-auto p-3 bg-blue-100 rounded-2xl w-fit">
                                    <Send className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-lg text-blue-700">Pay Merchant</CardTitle>
                                <CardDescription>
                                    Pay to Shopee, Grab, and more
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/withdraw">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200 hover:border-orange-300">
                            <CardHeader className="text-center">
                                <div className="mx-auto p-3 bg-orange-100 rounded-2xl w-fit">
                                    <ArrowDownCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-lg text-orange-700">Withdraw</CardTitle>
                                <CardDescription>
                                    Transfer to your bank account
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <History className="h-5 w-5 mr-2" />
                                Recent Transactions
                            </CardTitle>
                            <CardDescription>
                                Your latest payment activities
                            </CardDescription>
                        </div>
                        <Link href="/transactions">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                {getTransactionIcon(transaction.type)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {getTransactionDescription(transaction)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className={`font-semibold ${
                                                transaction.type === 'topup' ? 'text-green-600' : 
                                                transaction.type === 'withdrawal' ? 'text-orange-600' : 
                                                'text-blue-600'
                                            }`}>
                                                {transaction.type === 'topup' ? '+' : '-'}
                                                {formatCurrency(transaction.amount)}
                                            </p>
                                            {getStatusBadge(transaction.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No transactions yet</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Start by topping up your wallet
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}