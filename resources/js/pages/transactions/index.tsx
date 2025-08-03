import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    ArrowUpCircle, 
    ArrowDownCircle, 
    Send,
    History, 
    Filter,
    Eye
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

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
    withdrawal_request?: {
        bank_name: string;
        account_number: string;
    };
}

interface Props {
    transactions: {
        data: Transaction[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        type?: string;
        status?: string;
    };
    [key: string]: unknown;
}

export default function TransactionIndex({ transactions, filters }: Props) {
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
                return <ArrowUpCircle className="h-5 w-5 text-green-600" />;
            case 'payment':
                return <Send className="h-5 w-5 text-blue-600" />;
            case 'withdrawal':
                return <ArrowDownCircle className="h-5 w-5 text-orange-600" />;
            default:
                return <History className="h-5 w-5" />;
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
                return transaction.merchant 
                    ? `Payment to ${transaction.merchant.name}` 
                    : 'Merchant Payment';
            case 'withdrawal':
                return transaction.withdrawal_request 
                    ? `Withdrawal to ${transaction.withdrawal_request.bank_name}` 
                    : 'Withdrawal Request';
            default:
                return 'Transaction';
        }
    };

    const handleFilterChange = (type: 'type' | 'status', value: string) => {
        const params = new URLSearchParams();
        
        if (type === 'type' && value !== 'all') {
            params.set('type', value);
        }
        
        if (type === 'status' && value !== 'all') {
            params.set('status', value);
        }

        // Preserve other filters
        if (type !== 'type' && filters.type) {
            params.set('type', filters.type);
        }
        
        if (type !== 'status' && filters.status) {
            params.set('status', filters.status);
        }

        const queryString = params.toString();
        router.get(`/transactions${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <AppShell>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 Transaction History</h1>
                        <p className="mt-2 text-gray-600">
                            View and manage all your payment activities
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filter Transactions
                        </CardTitle>
                        <CardDescription>
                            Filter transactions by type and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Select
                                    value={filters.type || 'all'}
                                    onValueChange={(value) => handleFilterChange('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="topup">Top-up</SelectItem>
                                        <SelectItem value="payment">Payment</SelectItem>
                                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Transactions ({transactions.total})
                        </CardTitle>
                        <CardDescription>
                            {transactions.current_page} of {transactions.last_page} pages
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {transactions.data.length > 0 ? (
                            <div className="space-y-4">
                                {transactions.data.map((transaction) => (
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
                                                    {transaction.transaction_id} • {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
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
                                            <Link href={`/transactions/${transaction.transaction_id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No transactions found</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {filters.type || filters.status 
                                        ? 'Try adjusting your filters'
                                        : 'Start by making a payment or top-up'
                                    }
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {transactions.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-2 mt-8">
                                {transactions.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}