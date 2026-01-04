'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Truck, FileCheck, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';

export function DispatchNoteList({ notes }: { notes: any[] }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('search_dispatch_placeholder')}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('dispatch_no')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('date')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('customers')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('status')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {notes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {t('no_data')}
                                    </td>
                                </tr>
                            ) : (
                                notes.map((note) => (
                                    <tr key={note.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                                <Truck className="h-4 w-4 text-slate-400" />
                                                {note.dispatchNo}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {formatDate(note.date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {note.customerName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {note.linkedInvoiceId ? (
                                                <Badge variant="success" className="flex items-center gap-1 w-fit">
                                                    <FileCheck className="h-3 w-3" />
                                                    {t('invoiced')}
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning">{t('pending')}</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" title={t('view')}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
