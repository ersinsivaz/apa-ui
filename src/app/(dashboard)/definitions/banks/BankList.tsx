'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Plus, Edit2, Trash2, Landmark, Copy, Check } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { BankAccount } from '@/models/definitions';
import { createBankAccountAction, updateBankAccountAction, deleteBankAccountAction, toggleBankAccountStatusAction } from '../actions';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface BankListProps {
    initialAccounts: BankAccount[];
}

export function BankList({ initialAccounts }: BankListProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

    const [formState, setFormState] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        iban: '',
        currency: 'TRY',
        balance: 0,
        isActive: true
    });

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('delete_account_confirm'))) return;
        setIsProcessing(id);
        await deleteBankAccountAction(id);
        setIsProcessing(null);
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setIsProcessing(id);
        await toggleBankAccountStatusAction(id, currentStatus);
        setIsProcessing(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing('form');
        if (editingAccount) {
            await updateBankAccountAction(editingAccount.id, formState);
        } else {
            await createBankAccountAction(formState);
        }
        setIsProcessing(null);
        setIsFormOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormState({
            bankName: '',
            accountName: '',
            accountNumber: '',
            iban: '',
            currency: 'TRY',
            balance: 0,
            isActive: true
        });
        setEditingAccount(null);
    };

    const openEdit = (acc: BankAccount) => {
        setEditingAccount(acc);
        setFormState({
            bankName: acc.bankName,
            accountName: acc.accountName,
            accountNumber: acc.accountNumber,
            iban: acc.iban,
            currency: acc.currency,
            balance: acc.balance,
            isActive: acc.isActive
        });
        setIsFormOpen(true);
    };

    const filtered = initialAccounts.filter(acc =>
        acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button
                    className="flex items-center gap-2"
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                >
                    <Plus className="h-4 w-4" />
                    {t('add_account')}
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
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
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('bank_name')} & {t('account_name')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('bank_account_no')} / {t('iban')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('balance')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('status')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">{t('no_data')}</td>
                                    </tr>
                                ) : (
                                    filtered.map((acc) => (
                                        <tr key={acc.id} className={cn(
                                            "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group",
                                            isProcessing === acc.id && "opacity-50 pointer-events-none"
                                        )}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                        <Landmark className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">{acc.bankName}</div>
                                                        <div className="text-xs text-slate-500">{acc.accountName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium dark:text-slate-300">{acc.accountNumber}</div>
                                                    <div className="flex items-center gap-2 group/iban">
                                                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">{acc.iban}</div>
                                                        <button
                                                            onClick={() => handleCopy(acc.id, acc.iban)}
                                                            className="opacity-0 group-hover/iban:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                                        >
                                                            {copiedId === acc.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-slate-400" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(acc.balance, acc.currency)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggle(acc.id, acc.isActive)}
                                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                                >
                                                    <Badge variant={acc.isActive ? 'success' : 'default'} className="text-[10px]">
                                                        {acc.isActive ? t('active') : t('passive')}
                                                    </Badge>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 text-foreground">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => openEdit(acc)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600"
                                                        onClick={() => handleDelete(acc.id)}
                                                    >
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
                </CardContent>
            </Card>

            <Dialog
                isOpen={isFormOpen}
                onClose={() => { if (isProcessing !== 'form') setIsFormOpen(false); }}
                title={editingAccount ? t('edit_account') : t('add_account')}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('bank_name')}</label>
                        <Input
                            placeholder="Ziraat Bankası"
                            value={formState.bankName}
                            onChange={(e) => setFormState({ ...formState, bankName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('account_name')}</label>
                        <Input
                            placeholder={t('account_name')}
                            value={formState.accountName}
                            onChange={(e) => setFormState({ ...formState, accountName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('bank_account_no')}</label>
                            <Input
                                placeholder="1234-5678"
                                value={formState.accountNumber}
                                onChange={(e) => setFormState({ ...formState, accountNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('currency')}</label>
                            <Select
                                value={formState.currency}
                                onChange={(e) => setFormState({ ...formState, currency: e.target.value })}
                            >
                                <option value="TRY">TRY - Türk Lirası</option>
                                <option value="USD">USD - ABD Doları</option>
                                <option value="EUR">EUR - Euro</option>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('iban')}</label>
                        <Input
                            placeholder="TR00 0000 0000 0000 0000 0000 00"
                            value={formState.iban}
                            onChange={(e) => setFormState({ ...formState, iban: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('opening_balance')}</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formState.balance}
                            onChange={(e) => setFormState({ ...formState, balance: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsFormOpen(false)}
                            disabled={isProcessing === 'form'}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isProcessing === 'form'}
                        >
                            {isProcessing === 'form' ? t('saving') : t('save')}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
