'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Wallet, Search } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';

export function CashContent({ transactions, balance }: { transactions: any[], balance: number }) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">{t('total_cash_balance')}</p>
                                <h3 className="text-3xl font-bold mt-1">{formatCurrency(balance)}</h3>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <CardTitle className="text-md">{t('recent_transactions')}</CardTitle>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('search_transactions_placeholder')}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('date')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('description')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('type')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('amount')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            {t('no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {formatDate(tx.date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900 dark:text-white">{tx.description}</div>
                                                {tx.relatedInvoiceId && (
                                                    <div className="text-xs text-blue-500">{t('invoice_linked')}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={tx.type === 'Giriş' ? 'success' : 'error'}>
                                                    {tx.type === 'Giriş' ? t('inflow') : t('outflow')}
                                                </Badge>
                                            </td>
                                            <td className={cn(
                                                "px-6 py-4 text-right font-bold",
                                                tx.type === 'Giriş' ? "text-emerald-600" : "text-red-600"
                                            )}>
                                                {tx.type === 'Giriş' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
