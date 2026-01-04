'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Plus, Edit2, Trash2, Landmark, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { ExchangeRate } from '@/models/definitions';
import { updateExchangeRateAction, deleteExchangeRateAction } from '../actions';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface CurrencyListProps {
    initialRates: ExchangeRate[];
}

export function CurrencyList({ initialRates }: CurrencyListProps) {
    const { t } = useTranslation();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formState, setFormState] = useState({
        code: '',
        currency: '',
        buying: 0,
        selling: 0
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate fetching from an external API and updating
        for (const rate of initialRates) {
            const fluctuation = (Math.random() - 0.5) * 0.1;
            await updateExchangeRateAction(rate.code, {
                buying: rate.buying + fluctuation,
                selling: rate.selling + fluctuation,
            });
        }
        setIsRefreshing(false);
    };

    const handleDelete = async (code: string) => {
        if (!confirm(t('delete_currency_confirm'))) return;
        await deleteExchangeRateAction(code);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRefreshing(true);
        await updateExchangeRateAction(formState.code, formState);
        setIsRefreshing(false);
        setIsFormOpen(false);
        setFormState({ code: '', currency: '', buying: 0, selling: 0 });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    {t('add_currency')}
                </Button>
                <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    {t('update_rates')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialRates.map((rate) => (
                    <Card key={rate.code} className="hover:shadow-lg transition-shadow border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                        <CardContent className="p-6 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(rate.code)}
                                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                                    <span className="font-bold text-sm">{rate.code}</span>
                                </div>
                                <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    +0.24%
                                </Badge>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-500 font-medium mb-1">{t('currency')}</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{rate.currency}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{t('buying')}</div>
                                        <div className="text-md font-mono font-bold text-emerald-600">₺{rate.buying.toFixed(4)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{t('selling')}</div>
                                        <div className="text-md font-mono font-bold text-accent">₺{rate.selling.toFixed(4)}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {t('rate_details')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('currency')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('code')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('effective_buying')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('effective_selling')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('last_updated')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {initialRates.map((rate) => (
                                    <tr key={rate.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium dark:text-white">{rate.currency}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-mono">{rate.code}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-emerald-600">₺{rate.buying.toFixed(4)}</td>
                                        <td className="px-6 py-4 text-right font-mono text-accent">₺{rate.selling.toFixed(4)}</td>
                                        <td className="px-6 py-4 text-right text-xs text-slate-500">
                                            {new Date(rate.updatedAt).toLocaleString('tr-TR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={t('add_currency')}
                description="Eklenecek döviz cinsi ve kur bilgilerini giriniz."
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('currency_code')}</label>
                            <Input
                                placeholder="Örn: USD"
                                value={formState.code}
                                onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('currency_name')}</label>
                            <Input
                                placeholder="Örn: ABD Doları"
                                value={formState.currency}
                                onChange={(e) => setFormState({ ...formState, currency: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('buying_price')} (₺)</label>
                            <Input
                                type="number"
                                step="0.0001"
                                value={formState.buying}
                                onChange={(e) => setFormState({ ...formState, buying: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('selling_price')} (₺)</label>
                            <Input
                                type="number"
                                step="0.0001"
                                value={formState.selling}
                                onChange={(e) => setFormState({ ...formState, selling: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsFormOpen(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button type="submit">
                            {t('save')}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
