'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Wallet,
    PlusCircle,
    History,
    ArrowUpCircle,
    ArrowDownCircle
} from 'lucide-react';
import { formatCurrency, cn, formatDate } from '@/lib/utils';
import { CashBox } from '@/models/definitions';
import { CashTransaction } from '@/models/cash';
import {
    createCashBoxAction,
    updateCashBoxAction,
    deleteCashBoxAction,
    toggleCashBoxStatusAction,
    createCashMovementAction,
    getCashMovementsAction,
    deleteCashMovementAction
} from '../actions';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface CashListProps {
    initialBoxes: CashBox[];
}

export function CashList({ initialBoxes }: CashListProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBox, setEditingBox] = useState<CashBox | null>(null);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, boxId: string } | null>(null);
    const [selectedBox, setSelectedBox] = useState<CashBox | null>(null);

    // Movement States
    const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
    const [isMovementsListOpen, setIsMovementsListOpen] = useState(false);
    const [movements, setMovements] = useState<CashTransaction[]>([]);
    const [isLoadingMovements, setIsLoadingMovements] = useState(false);

    const [boxFormState, setBoxFormState] = useState({
        name: '',
        code: '',
        currency: 'TRY',
        balance: 0,
        isActive: true
    });

    const [movementFormState, setMovementFormState] = useState({
        cashBoxId: '',
        type: 'Giriş' as 'Giriş' | 'Çıkış',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const filtered = initialBoxes.filter(box =>
        box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm(t('delete_cash_confirm'))) return;
        setIsProcessing(id);
        await deleteCashBoxAction(id);
        setIsProcessing(null);
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        setIsProcessing(id);
        await toggleCashBoxStatusAction(id, currentStatus);
        setIsProcessing(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing('form');
        if (editingBox) {
            await updateCashBoxAction(editingBox.id, boxFormState);
        } else {
            await createCashBoxAction(boxFormState);
        }
        setIsProcessing(null);
        setIsFormOpen(false);
        resetBoxForm();
    };

    const handleMovementSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBox) return;

        setIsProcessing('movement-form');
        await createCashMovementAction({
            ...movementFormState,
            cashBoxId: selectedBox.id
        });
        setIsProcessing(null);
        setIsMovementFormOpen(false);
        setMovementFormState({
            cashBoxId: '',
            type: 'Giriş',
            amount: 0,
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleDeleteMovement = async (id: string) => {
        if (!confirm(t('delete_transaction_confirm'))) return;
        await deleteCashMovementAction(id);
        if (selectedBox) {
            loadMovements(selectedBox.id);
        }
    };

    const loadMovements = async (boxId: string) => {
        setIsLoadingMovements(true);
        const data = await getCashMovementsAction(boxId);
        setMovements(data);
        setIsLoadingMovements(false);
    };

    const resetBoxForm = () => {
        setBoxFormState({
            name: '',
            code: '',
            currency: 'TRY',
            balance: 0,
            isActive: true
        });
        setEditingBox(null);
    };

    const openEdit = (box: CashBox) => {
        setEditingBox(box);
        setBoxFormState({
            name: box.name,
            code: box.code,
            currency: box.currency,
            balance: box.balance,
            isActive: box.isActive
        });
        setIsFormOpen(true);
    };

    const handleContextMenu = (e: React.MouseEvent, box: CashBox) => {
        e.preventDefault();
        setSelectedBox(box);
        setContextMenu({ x: e.clientX, y: e.clientY, boxId: box.id });
    };

    return (
        <div className="space-y-6">
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
                    <Button onClick={() => { resetBoxForm(); setIsFormOpen(true); }} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {t('new')}
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('cash_name')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('cash_code')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('currency')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('balance')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('status')}</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            {t('no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((box) => (
                                        <tr
                                            key={box.id}
                                            onContextMenu={(e) => handleContextMenu(e, box)}
                                            className={cn(
                                                "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-context-menu",
                                                !box.isActive && "opacity-60 bg-slate-50/50 dark:bg-slate-800/20"
                                            )}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                                        <Wallet className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white">{box.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                                {box.code}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <Badge variant="outline">{box.currency}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(box.balance, box.currency)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggle(box.id, box.isActive)}
                                                    disabled={isProcessing === box.id}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                                                        box.isActive
                                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                                    )}
                                                >
                                                    {isProcessing === box.id ? '...' : (box.isActive ? t('active') : t('passive'))}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        onClick={() => openEdit(box)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                        onClick={() => handleDelete(box.id)}
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

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    items={[
                        {
                            label: t('add_transaction'),
                            icon: PlusCircle,
                            onClick: () => {
                                if (selectedBox) {
                                    setMovementFormState(prev => ({ ...prev, cashBoxId: selectedBox.id }));
                                    setIsMovementFormOpen(true);
                                }
                            }
                        },
                        {
                            label: t('cash_movements'),
                            icon: History,
                            onClick: () => {
                                if (selectedBox) {
                                    loadMovements(selectedBox.id);
                                    setIsMovementsListOpen(true);
                                }
                            }
                        },
                        {
                            label: t('edit'),
                            icon: Edit2,
                            onClick: () => selectedBox && openEdit(selectedBox)
                        },
                        {
                            label: t('delete'),
                            icon: Trash2,
                            onClick: () => selectedBox && handleDelete(selectedBox.id),
                            variant: 'danger'
                        }
                    ]}
                />
            )}

            {/* Create/Edit Modal */}
            <Dialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingBox ? t('edit_cash') : t('add_cash')}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('cash_name')}</label>
                        <Input
                            required
                            value={boxFormState.name}
                            onChange={(e) => setBoxFormState({ ...boxFormState, name: e.target.value })}
                            placeholder={t('cash_name')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('cash_code')}</label>
                            <Input
                                required
                                value={boxFormState.code}
                                onChange={(e) => setBoxFormState({ ...boxFormState, code: e.target.value })}
                                placeholder="TRK01"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('currency')}</label>
                            <Select
                                value={boxFormState.currency}
                                onChange={(e) => setBoxFormState({ ...boxFormState, currency: e.target.value })}
                            >
                                <option value="TRY">TRY</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </Select>
                        </div>
                    </div>
                    {!editingBox && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('opening_balance')}</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={boxFormState.balance}
                                onChange={(e) => setBoxFormState({ ...boxFormState, balance: parseFloat(e.target.value) })}
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={isProcessing === 'form'}>
                            {isProcessing === 'form' ? t('saving') : t('save')}
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Add Movement Modal */}
            <Dialog
                isOpen={isMovementFormOpen}
                onClose={() => setIsMovementFormOpen(false)}
                title={`${selectedBox?.name} - ${t('add_transaction')}`}
            >
                <form onSubmit={handleMovementSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('transaction_type')}</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={movementFormState.type === 'Giriş' ? 'primary' : 'outline'}
                                    onClick={() => setMovementFormState({ ...movementFormState, type: 'Giriş' })}
                                    className={cn("flex-1", movementFormState.type === 'Giriş' && "bg-emerald-600 hover:bg-emerald-700")}
                                >
                                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                                    {t('inflow')}
                                </Button>
                                <Button
                                    type="button"
                                    variant={movementFormState.type === 'Çıkış' ? 'primary' : 'outline'}
                                    onClick={() => setMovementFormState({ ...movementFormState, type: 'Çıkış' })}
                                    className={cn("flex-1", movementFormState.type === 'Çıkış' && "bg-rose-600 hover:bg-rose-700")}
                                >
                                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                                    {t('outflow')}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('date')}</label>
                            <Input
                                type="date"
                                required
                                value={movementFormState.date}
                                onChange={(e) => setMovementFormState({ ...movementFormState, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('amount')}</label>
                        <div className="relative">
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={movementFormState.amount}
                                onChange={(e) => setMovementFormState({ ...movementFormState, amount: parseFloat(e.target.value) })}
                                className="pl-12 text-lg font-bold"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                {selectedBox?.currency}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('description')}</label>
                        <Input
                            required
                            value={movementFormState.description}
                            onChange={(e) => setMovementFormState({ ...movementFormState, description: e.target.value })}
                            placeholder={t('description')}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsMovementFormOpen(false)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={isProcessing === 'movement-form'}>
                            {isProcessing === 'movement-form' ? t('saving') : t('save')}
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Movements List Modal */}
            <Dialog
                isOpen={isMovementsListOpen}
                onClose={() => setIsMovementsListOpen(false)}
                title={`${selectedBox?.name} - ${t('cash_movements')}`}
            >
                <div className="space-y-4">
                    {isLoadingMovements ? (
                        <div className="text-center py-8 text-slate-500">{t('loading')}</div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">{t('no_history')}</div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left">{t('date')}</th>
                                        <th className="px-4 py-2 text-left">{t('description')}</th>
                                        <th className="px-4 py-2 text-right">{t('amount')}</th>
                                        <th className="px-4 py-2 text-center">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {movements.map(m => (
                                        <tr key={m.id}>
                                            <td className="px-4 py-2 text-slate-500">{formatDate(m.date)}</td>
                                            <td className="px-4 py-2">
                                                <div className="font-medium">{m.description}</div>
                                                <div className="text-xs text-slate-400">{m.type === 'Giriş' ? t('inflow') : t('outflow')}</div>
                                            </td>
                                            <td className={cn(
                                                "px-4 py-2 text-right font-bold",
                                                m.type === 'Giriş' ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {m.type === 'Giriş' ? '+' : '-'}{formatCurrency(m.amount)}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleDeleteMovement(m.id)}
                                                    className="text-slate-400 hover:text-rose-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => setIsMovementsListOpen(false)}>
                            {t('close')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
