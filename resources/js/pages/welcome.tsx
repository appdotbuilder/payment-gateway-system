import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CreditCard, History, Shield, Smartphone, Users, Wallet } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Hero Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl m-8"></div>
                    <div className="relative px-6 py-24 mx-auto max-w-7xl sm:px-8 lg:px-12">
                        <div className="text-center">
                            <div className="flex justify-center mb-8">
                                <div className="p-4 bg-blue-100 rounded-2xl">
                                    <Wallet className="w-16 h-16 text-blue-600" />
                                </div>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                💳 PayGate
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                                Your comprehensive payment gateway solution. Top-up with Dana, pay merchants, 
                                manage your digital wallet, and request withdrawals - all in one secure platform.
                            </p>
                            
                            {auth?.user ? (
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link href="/dashboard">
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link href="/register">
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="outline" size="lg">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 bg-white/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                🚀 Everything You Need for Digital Payments
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Professional payment gateway with Dana integration, merchant payments, and comprehensive transaction management.
                            </p>
                        </div>
                        
                        <div className="mx-auto mt-16 max-w-5xl">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="p-2 bg-green-100 rounded-lg w-fit">
                                            <Smartphone className="h-6 w-6 text-green-600" />
                                        </div>
                                        <CardTitle className="text-xl">💰 Dana Integration</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            Seamlessly top-up your digital wallet using Dana payment gateway with secure sandbox testing.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg w-fit">
                                            <CreditCard className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-xl">🏪 Merchant Payments</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            Pay to predefined merchants like Shopee, Tokopedia, Grab, and Gojek directly from your wallet.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg w-fit">
                                            <History className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <CardTitle className="text-xl">📊 Transaction History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            Complete transaction tracking with detailed history, filters, and real-time status updates.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="p-2 bg-orange-100 rounded-lg w-fit">
                                            <Wallet className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <CardTitle className="text-xl">💸 Withdraw Funds</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            Request withdrawals to your bank account with admin approval system for security.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="p-2 bg-red-100 rounded-lg w-fit">
                                            <Users className="h-6 w-6 text-red-600" />
                                        </div>
                                        <CardTitle className="text-xl">👥 Admin Panel</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            Comprehensive admin dashboard for managing users, transactions, and withdrawal approvals.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="p-2 bg-emerald-100 rounded-lg w-fit">
                                            <Shield className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <CardTitle className="text-xl">🔒 Secure & Reliable</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            Built with Laravel and modern security practices, featuring role-based access control.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                🎯 Ready to Start?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                Join thousands of users managing their digital payments with PayGate. 
                                Secure, fast, and reliable payment processing at your fingertips.
                            </p>
                            
                            {!auth?.user && (
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link href="/register">
                                        <Button size="lg" variant="secondary">
                                            Create Account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:max-w-none">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Trusted by Users Everywhere
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-gray-600">
                                    PayGate delivers reliable payment processing with enterprise-grade security.
                                </p>
                            </div>
                            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col bg-gray-400/5 p-8">
                                    <dt className="text-sm font-semibold leading-6 text-gray-600">Supported Merchants</dt>
                                    <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">5+</dd>
                                </div>
                                <div className="flex flex-col bg-gray-400/5 p-8">
                                    <dt className="text-sm font-semibold leading-6 text-gray-600">Payment Methods</dt>
                                    <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">Dana</dd>
                                </div>
                                <div className="flex flex-col bg-gray-400/5 p-8">
                                    <dt className="text-sm font-semibold leading-6 text-gray-600">Transaction Types</dt>
                                    <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">3</dd>
                                </div>
                                <div className="flex flex-col bg-gray-400/5 p-8">
                                    <dt className="text-sm font-semibold leading-6 text-gray-600">User Roles</dt>
                                    <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">2</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}