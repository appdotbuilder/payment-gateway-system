import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    CreditCard, 
    Clock, 
    TrendingUp,
    ArrowUpCircle,
    ArrowDownCircle,
    Send,
    AlertCircle
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Transaction {
    id: number;
    transaction_id: string;
    type: 'topup' | 'payment' | 'withdrawal';
    amount: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    merchant?: {
        name: string;
    };
}

interface WithdrawalRequest {
    id: number;
    amount: string;
    bank_name: string;
    account_number: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface Stats {
    totalUsers: number;
    totalTransactions: number;
    pendingWithdrawals: number;
    totalVolume: string;
}

interface Props {
    stats: Stats;
    recentTransactions: Transaction[];
    pendingWithdrawals: WithdrawalRequest[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recentTransactions, pendingWithdrawals }: Props) {
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

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🛠️ Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        System overview and management tools
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered customers
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                All time transactions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.pendingWithdrawals}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.totalVolume)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Completed transactions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Withdrawals Alert */}
                {stats.pendingWithdrawals > 0 && (
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-orange-800">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Action Required
                            </CardTitle>
                            <CardDescription className="text-orange-700">
                                You have {stats.pendingWithdrawals} withdrawal request{stats.pendingWithdrawals > 1 ? 's' : ''} waiting for approval.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/admin/withdrawals?status=pending">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    Review Withdrawals
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>
                                    Latest system-wide activities
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/transactions">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentTransactions.length > 0 ? (
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="p-1 bg-white rounded">
                                                    {getTransactionIcon(transaction.type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {transaction.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {transaction.type === 'payment' && transaction.merchant
                                                            ? `Paid ${transaction.merchant.name}`
                                                            : transaction.type === 'topup'
                                                            ? 'Top-up via Dana'
                                                            : 'Withdrawal request'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-sm font-semibold">
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                                {getStatusBadge(transaction.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No recent transactions</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pending Withdrawals */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Pending Withdrawals</CardTitle>
                                <CardDescription>
                                    Requests awaiting approval
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/withdrawals">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {pendingWithdrawals.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingWithdrawals.map((withdrawal) => (
                                        <div
                                            key={withdrawal.id}
                                            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="p-1 bg-white rounded">
                                                    <ArrowDownCircle className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {withdrawal.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {withdrawal.bank_name} - {withdrawal.account_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-sm font-semibold text-orange-600">
                                                    {formatCurrency(withdrawal.amount)}
                                                </p>
                                                <Link href={`/admin/withdrawals/${withdrawal.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        Review
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No pending withdrawals</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/admin/withdrawals?status=pending">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer border-orange-200">
                                    <CardContent className="p-4 text-center">
                                        <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                        <p className="font-medium text-orange-700">
                                            Process Withdrawals
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {stats.pendingWithdrawals} pending
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/admin/users">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200">
                                    <CardContent className="p-4 text-center">
                                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                        <p className="font-medium text-blue-700">
                                            User Management
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {stats.totalUsers} users
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/admin/transactions">
                                <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200">
                                    <CardContent className="p-4 text-center">
                                        <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                        <p className="font-medium text-green-700">
                                            View Transactions
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {stats.totalTransactions} total
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}