'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Users,
    Package,
    FileText,
    Wallet,
    Landmark,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { SalesChart, ProfitLossChart } from '@/components/ui/SalesChart';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface DashboardContentProps {
    customers: any[];
    stocks: any[];
    invoices: any[];
    cashBalance: number;
    bankAccounts: any[];
    chartData: any[];
    monthlyData: any[];
    totalReceivable: number;
    totalPayable: number;
    bankBalance: number;
}

export function DashboardContent({
    customers,
    stocks,
    invoices,
    cashBalance,
    bankAccounts,
    chartData,
    monthlyData,
    totalReceivable,
    totalPayable,
    bankBalance
}: DashboardContentProps) {
    const { t } = useTranslation();

    const stats = [
        { name: t('total_customers'), value: customers.length, icon: Users, color: 'bg-accent' },
        { name: t('stock_items'), value: stocks.length, icon: Package, color: 'bg-emerald-500' },
        { name: t('cash_balance'), value: formatCurrency(cashBalance), icon: Wallet, color: 'bg-amber-500' },
        { name: t('bank_balance'), value: formatCurrency(bankBalance), icon: Landmark, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('overall_overview')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('overview_description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.name} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</h3>
                                </div>
                                <div className={cn(stat.color, "p-3 rounded-lg text-white shadow-lg shadow-accent/20")}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SalesChart data={chartData} title={t('daily_sales_trend')} />
                <ProfitLossChart data={monthlyData} title={t('monthly_profit_loss')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('debt_receivable_status')}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                                        <ArrowDownRight className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase">{t('total_receivable')}</p>
                                        <p className="text-xl font-bold text-emerald-900 dark:text-emerald-300">{formatCurrency(totalReceivable)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                                        <ArrowUpRight className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-red-700 dark:text-red-400 font-semibold uppercase">{t('total_payable')}</p>
                                        <p className="text-xl font-bold text-red-900 dark:text-red-300">{formatCurrency(totalPayable)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('recent_invoices')}</h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {invoices.length === 0 ? (
                                    <p className="p-6 text-center text-slate-500 text-sm">{t('no_invoices')}</p>
                                ) : (
                                    invoices.slice(0, 5).map((invoice) => (
                                        <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    invoice.type === 'Satış' ? "bg-accent/10 text-accent" : "bg-purple-100 text-purple-600"
                                                )}>
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{invoice.customerName}</p>
                                                    <p className="text-xs text-slate-500">{invoice.invoiceNo} • {formatDate(invoice.date)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(invoice.grandTotal)}</p>
                                                <Badge variant={invoice.status === 'Açık' ? 'warning' : 'success'} className="text-[10px] px-1.5">
                                                    {invoice.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
                                <Link href="/invoices" className="text-accent text-xs font-semibold hover:underline">
                                    {t('view_all')}
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
