'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Plus, Search, Eye, FileText, XCircle, MoreVertical,
    CreditCard, History, Ban, CheckCircle2, Calendar
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { Invoice, Payment, Installment } from '@/models/invoice';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/components/providers/LanguageProvider';
import {
    recordPaymentAction,
    getPaymentsAction,
    cancelInvoiceAction,
    getPaymentSourcesAction
} from './actions';

interface InvoiceListProps {
    initialInvoices: Invoice[];
}

export function InvoiceList({ initialInvoices }: InvoiceListProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, invoice: Invoice } | null>(null);

    // Dialog States
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
    const [isInstallmentDialogOpen, setIsInstallmentDialogOpen] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentSources, setPaymentSources] = useState<{ cashBoxes: any[], bankAccounts: any[] }>({ cashBoxes: [], bankAccounts: [] });

    const [paymentForm, setPaymentForm] = useState({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Kasa' as 'Kasa' | 'Banka',
        sourceId: '',
        description: '',
        installmentId: ''
    });

    const filtered = initialInvoices.filter(inv =>
        inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContextMenu = (e: React.MouseEvent, invoice: Invoice) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, invoice });
    };

    const openPaymentDialog = async (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        const sources = await getPaymentSourcesAction();
        setPaymentSources(sources);
        setPaymentForm({
            amount: invoice.grandTotal - (invoice.paidAmount || 0),
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Kasa',
            sourceId: sources.cashBoxes[0]?.id || '',
            description: `${invoice.invoiceNo} tahsilatı`,
            installmentId: ''
        });
        setIsPaymentDialogOpen(true);
    };

    const openHistoryDialog = async (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        const history = await getPaymentsAction(invoice.id);
        setPayments(history as Payment[]);
        setIsHistoryDialogOpen(true);
    };

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;

        const source = paymentForm.paymentMethod === 'Kasa'
            ? paymentSources.cashBoxes.find(b => b.id === paymentForm.sourceId)
            : paymentSources.bankAccounts.find(a => a.id === paymentForm.sourceId);

        await recordPaymentAction({
            ...paymentForm,
            invoiceId: selectedInvoice.id,
            sourceName: source?.name || source?.accountName || ''
        });

        setIsPaymentDialogOpen(false);
    };

    const handleCancelInvoice = async (invoice: Invoice) => {
        if (confirm(t('cancel_invoice_confirm')?.replace('{no}', invoice.invoiceNo) || `${invoice.invoiceNo} nolu faturayı iptal etmek istediğinize emin misiniz?`)) {
            await cancelInvoiceAction(invoice.id);
        }
    };

    // Helper to translate status
    const translateStatus = (status: string) => {
        switch (status) {
            case 'Açık': return t('unpaid');
            case 'Kısmi Ödendi': return t('partial_paid');
            case 'Ödendi': return t('paid');
            case 'İptal': return t('cancel');
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('search_invoices_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-accent outline-none"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('invoice_no')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('date')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('customers')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('type')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('total')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('paid')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('status')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                            {t('no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            onContextMenu={(e) => handleContextMenu(e, invoice)}
                                            className={cn(
                                                "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-context-menu relative",
                                                contextMenu?.invoice.id === invoice.id && "bg-accent/5"
                                            )}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 font-medium text-accent">
                                                    <FileText className="h-4 w-4" />
                                                    {invoice.invoiceNo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {formatDate(invoice.date)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                {invoice.customerName}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Badge variant={invoice.type === 'Satış' ? 'outline' : 'default'} className={cn(
                                                    "uppercase text-[10px]",
                                                    invoice.type === 'Satış' ? "text-accent border-accent/20 bg-accent/5" : "text-purple-600 border-purple-200 bg-purple-50"
                                                )}>
                                                    {invoice.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(invoice.grandTotal)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-emerald-600 font-medium">
                                                {formatCurrency(invoice.paidAmount || 0)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={
                                                    invoice.status === 'Açık' ? 'warning' :
                                                        invoice.status === 'Kısmi Ödendi' ? 'warning' :
                                                            invoice.status === 'Ödendi' ? 'success' : 'error'
                                                }>
                                                    {translateStatus(invoice.status)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openHistoryDialog(invoice)} title={t('payment_history')}>
                                                        <History className="h-4 w-4" />
                                                    </Button>
                                                    {invoice.status !== 'Ödendi' && invoice.status !== 'İptal' && (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => openPaymentDialog(invoice)} title={t('collect_payment')}>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
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

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    items={[
                        {
                            label: contextMenu.invoice.type === 'Satış' ? t('collect_payment') : t('make_payment'),
                            icon: CreditCard,
                            onClick: () => openPaymentDialog(contextMenu.invoice)
                        },
                        {
                            label: t('payment_history'),
                            icon: History,
                            onClick: () => openHistoryDialog(contextMenu.invoice)
                        },
                        {
                            label: t('installment_plan'),
                            icon: Calendar,
                            onClick: () => { setSelectedInvoice(contextMenu.invoice); setIsInstallmentDialogOpen(true); }
                        },
                        {
                            label: t('cancel_invoice'),
                            icon: Ban,
                            onClick: () => handleCancelInvoice(contextMenu.invoice),
                            variant: 'danger'
                        },
                    ]}
                />
            )}

            {/* Payment Dialog */}
            <Dialog
                isOpen={isPaymentDialogOpen}
                onClose={() => setIsPaymentDialogOpen(false)}
                title={selectedInvoice?.type === 'Satış' ? t('payment_received') : t('payment_made')}
                description={t('payment_entry_description')?.replace('{no}', selectedInvoice?.invoiceNo || '')}
            >
                <form onSubmit={handleRecordPayment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('amount')}</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={paymentForm.amount}
                                onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('date')}</label>
                            <Input
                                type="date"
                                value={paymentForm.date}
                                onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {selectedInvoice?.installments && selectedInvoice.installments.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-amber-600">{t('related_installment')}</label>
                            <Select
                                value={paymentForm.installmentId}
                                onChange={(e) => {
                                    const insId = e.target.value;
                                    const ins = selectedInvoice.installments?.find(i => i.id === insId);
                                    setPaymentForm({
                                        ...paymentForm,
                                        installmentId: insId,
                                        amount: ins ? ins.amount : paymentForm.amount
                                    });
                                }}
                            >
                                <option value="">{t('select_installment')}</option>
                                {selectedInvoice.installments.filter(i => i.status === 'Bekliyor').map(ins => (
                                    <option key={ins.id} value={ins.id}>
                                        {formatDate(ins.dueDate)} - {formatCurrency(ins.amount)}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('payment_method')}</label>
                            <Select
                                value={paymentForm.paymentMethod}
                                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any, sourceId: '' })}
                            >
                                <option value="Kasa">{t('cash')}</option>
                                <option value="Banka">{t('bank')}</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{paymentForm.paymentMethod === 'Kasa' ? t('cash') : t('bank')}</label>
                            <Select
                                value={paymentForm.sourceId}
                                onChange={(e) => setPaymentForm({ ...paymentForm, sourceId: e.target.value })}
                                required
                            >
                                <option value="">{t('select_source')}</option>
                                {paymentForm.paymentMethod === 'Kasa'
                                    ? paymentSources.cashBoxes.map(b => <option key={b.id} value={b.id}>{b.name} ({b.currency})</option>)
                                    : paymentSources.bankAccounts.map(a => <option key={a.id} value={a.id}>{a.bankName} - {a.accountName}</option>)
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('description')}</label>
                        <Input
                            value={paymentForm.description}
                            onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>{t('cancel')}</Button>
                        <Button type="submit">{t('save')}</Button>
                    </div>
                </form>
            </Dialog>

            {/* History Dialog */}
            <Dialog
                isOpen={isHistoryDialogOpen}
                onClose={() => setIsHistoryDialogOpen(false)}
                title={t('history_title')}
                description={t('history_description')?.replace('{no}', selectedInvoice?.invoiceNo || '')}
            >
                <div className="space-y-3">
                    {payments.length === 0 ? (
                        <p className="py-8 text-center text-slate-500">{t('no_history')}</p>
                    ) : (
                        payments.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{p.sourceName}</div>
                                    <div className="text-xs text-slate-500">{formatDate(p.date)} - {p.paymentMethod}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-emerald-600">{formatCurrency(p.amount)}</div>
                                    <div className="text-[10px] text-slate-400">{p.description}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>{t('close')}</Button>
                </div>
            </Dialog>

            {/* Installments Dialog */}
            <Dialog
                isOpen={isInstallmentDialogOpen}
                onClose={() => setIsInstallmentDialogOpen(false)}
                title={t('installment_plan')}
                description={t('installments_description')?.replace('{no}', selectedInvoice?.invoiceNo || '')}
            >
                <div className="space-y-3">
                    {!selectedInvoice?.installments || selectedInvoice.installments.length === 0 ? (
                        <p className="py-8 text-center text-slate-500">{t('no_installments')}</p>
                    ) : (
                        selectedInvoice.installments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((ins, idx) => (
                            <div key={ins.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{formatDate(ins.dueDate)}</div>
                                        <div className="text-xs text-slate-500">{t('due_date')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(ins.amount)}</div>
                                    <Badge variant={ins.status === 'Ödendi' ? 'success' : 'warning'} className="text-[10px]">
                                        {translateStatus(ins.status)}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={() => setIsInstallmentDialogOpen(false)}>{t('close')}</Button>
                </div>
            </Dialog>
        </div>
    );
}
