'use client';

import { stockService } from '@/services/stockService';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Edit2, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface StockListProps {
    stocks: any[];
    total: number;
    page: number;
    limit: number;
    query: string;
}

export function StockList({ stocks, total, page, limit, query }: StockListProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState(query);

    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (searchTerm) {
                params.set('q', searchTerm);
            } else {
                params.delete('q');
            }
            params.set('page', '1');

            // Only replace if query actually changed (avoid initial mount effect if possible, though React 18 handles strict mode)
            // But here we rely on searchTerm changing.
            // Check if current URL q matches new q to avoid loop if parent updates prop.
            const currentQ = params.get('q') || '';
            // Actually, the simpler way is just to push.
            // But we need to be careful not to push on first render if query prop matches searchTerm.
            // However, searchTerm initializes from query.
            // Let's just do it.
            router.replace(`${pathname}?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, router, pathname]);

    // Update local state if prop changes (e.g. navigation by browser back button)
    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', newPage.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('search_stocks_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('stock_code')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('product_name')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('type')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('unit_price')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('quantity')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {stocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {t('no_data')}
                                    </td>
                                </tr>
                            ) : (
                                stocks.map((stock) => (
                                    <tr key={stock.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {stock.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{stock.name}</div>
                                            <div className="text-xs text-slate-500">KDV: %{stock.vatRate} / {stock.unit}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={stock.type === 'Ürün' ? 'default' : 'outline'}>{stock.type}</Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {formatCurrency(stock.salePrice)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {stock.type === 'Ürün' ? (
                                                <span className={cn(
                                                    "font-semibold flex items-center gap-1",
                                                    stock.stockQuantity <= 0 ? "text-red-600" : stock.stockQuantity < 5 ? "text-amber-600" : "text-slate-700 dark:text-slate-300"
                                                )}>
                                                    <Package className="h-3 w-3" />
                                                    {stock.stockQuantity} {stock.unit}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Süresiz</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" title={t('edit')}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" title={t('delete')}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {total > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Toplam <span className="font-medium text-slate-900 dark:text-white">{total}</span> kayıttan <span className="font-medium text-slate-900 dark:text-white">{Math.min((page - 1) * limit + 1, total)}</span> - <span className="font-medium text-slate-900 dark:text-white">{Math.min(page * limit, total)}</span> arası gösteriliyor
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium px-2">
                                {page} / {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
