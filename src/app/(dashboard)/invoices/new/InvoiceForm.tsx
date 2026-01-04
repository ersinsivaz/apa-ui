'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createInvoiceAction, createQuickStockAction } from '@/app/(dashboard)/invoices/actions';
import { ArrowLeft, Save, Plus, Trash2, Calculator, Loader2, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Customer } from '@/models/customer';
import { Stock, StockType } from '@/models/stock';
import { Dialog } from '@/components/ui/Dialog';

interface InvoiceFormProps {
    initialType: 'Satış' | 'Alış';
    customers: Customer[];
    stocks: Stock[];
}

interface LineItem {
    id: string;
    stockId: string;
    quantity: number;
    unitPrice: number;
}

interface InstallmentItem {
    id: string;
    dueDate: string;
    amount: number;
}

export function InvoiceForm({ initialType, customers, stocks: initialStocks }: InvoiceFormProps) {
    const [stocks, setStocks] = useState<Stock[]>(initialStocks);
    const [items, setItems] = useState<LineItem[]>([
        { id: Math.random().toString(), stockId: '', quantity: 1, unitPrice: 0 }
    ]);
    const [totals, setTotals] = useState({ sub: 0, vat: 0, grand: 0 });
    const [installments, setInstallments] = useState<InstallmentItem[]>([]);
    const [showInstallments, setShowInstallments] = useState(false);

    // Quick Add Stock State
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [activeLineId, setActiveLineId] = useState<string | null>(null);
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [newStock, setNewStock] = useState({
        name: '',
        code: '',
        type: 'Hizmet' as StockType,
        salePrice: 0,
        vatRate: 20
    });

    // Search Dialog State
    const [showSearchDialog, setShowSearchDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Payment Plan State
    const [downPayment, setDownPayment] = useState(0);
    const [installmentCount, setInstallmentCount] = useState(1);
    const [validationDiff, setValidationDiff] = useState(0);
    const [planTotal, setPlanTotal] = useState(0);

    useEffect(() => {
        let sub = 0;
        let vat = 0;

        items.forEach(item => {
            const stock = stocks.find(s => s.id === item.stockId);
            const lineSub = item.quantity * item.unitPrice;
            const lineVat = stock ? (lineSub * stock.vatRate) / 100 : 0;

            sub += lineSub;
            vat += lineVat;
        });

        const newGrand = sub + vat;
        setTotals({ sub, vat, grand: newGrand });
    }, [items, stocks]);

    // Validate Plan whenever relevant values change
    useEffect(() => {
        if (!showInstallments) return;
        const totalInstallments = installments.reduce((acc, curr) => acc + curr.amount, 0);
        const currentTotal = downPayment + totalInstallments;
        setPlanTotal(currentTotal);

        // Use a small epsilon for floating point comparison
        const diff = totals.grand - currentTotal;
        setValidationDiff(Math.abs(diff) < 0.01 ? 0 : diff);

    }, [installments, downPayment, totals.grand, showInstallments]);

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), stockId: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length === 1) return;
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: string, field: keyof LineItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'stockId') {
                    if (value === 'NEW') {
                        setActiveLineId(id);
                        setNewStock({ ...newStock, code: `STK-${Math.floor(Math.random() * 10000)}` });
                        setShowQuickAdd(true);
                        return item; // Don't update quite yet
                    }
                    const stock = stocks.find(s => s.id === value);
                    if (stock) updated.unitPrice = stock.salePrice;
                }
                return updated;
            }
            return item;
        }));
    };

    const handleQuickAddSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingStock(true);
        try {
            const createdStock = await createQuickStockAction(newStock);
            if (createdStock) {
                setStocks([...stocks, createdStock]);
                if (activeLineId) {
                    updateItem(activeLineId, 'stockId', createdStock.id);
                }
                setShowQuickAdd(false);
                setNewStock({
                    name: '',
                    code: '',
                    type: 'Hizmet',
                    salePrice: 0,
                    vatRate: 20
                });
            }
        } catch (error) {
            console.error('Error creating stock:', error);
            alert('Stok oluşturulurken bir hata oluştu.');
        } finally {
            setIsAddingStock(false);
        }
    };

    const generateInstallments = () => {
        const remainingAmount = totals.grand - downPayment;

        if (installmentCount <= 0 || remainingAmount <= 0) {
            setInstallments([]);
            return;
        }

        const amountPerInstallment = parseFloat((remainingAmount / installmentCount).toFixed(2));
        const newInstallments: InstallmentItem[] = [];

        for (let i = 0; i < installmentCount; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() + i + 1); // Start from next month usually for installments

            // Adjust last installment to cover rounding differences automatically initially
            let amount = amountPerInstallment;
            if (i === installmentCount - 1) {
                const currentSum = amountPerInstallment * (installmentCount - 1);
                amount = parseFloat((remainingAmount - currentSum).toFixed(2));
            }

            newInstallments.push({
                id: Math.random().toString(),
                dueDate: d.toISOString().split('T')[0],
                amount
            });
        }
        setInstallments(newInstallments);
    };

    const resolveDiff = (position: 'first' | 'last') => {
        if (installments.length === 0) return;

        const newInstallments = [...installments];
        const index = position === 'first' ? 0 : newInstallments.length - 1;

        // Add diff to the selected installment
        // Note: validationDiff is (Expected - Current). So if we are short (positive diff), we add. If over (negative diff), we subtract.
        // But we computed validationDiff as (totals.grand - currentTotal). 
        // Example: Grand 100, Plan 90. Diff 10. We need to ADD 10.
        // Example: Grand 100, Plan 110. Diff -10. We need to SUBTRACT 10 (add -10).

        const currentAmount = newInstallments[index].amount;
        newInstallments[index].amount = parseFloat((currentAmount + validationDiff).toFixed(2));

        setInstallments(newInstallments);
    };

    const updateInstallment = (id: string, field: keyof InstallmentItem, value: any) => {
        setInstallments(installments.map(ins => ins.id === id ? { ...ins, [field]: value } : ins));
    };

    return (
        <>
            <form action={createInvoiceAction} className="space-y-6">
                <input type="hidden" name="type" value={initialType} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fatura Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="invoiceNo">Fatura No</Label>
                                        <Input id="invoiceNo" name="invoiceNo" placeholder="FAT-2024-001" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Tarih</Label>
                                        <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label htmlFor="customerId">Müşteri</Label>
                                        <Select id="customerId" name="customerId" required>
                                            <option value="">Müşteri seçin...</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <CardTitle className="text-md">Fatura Kalemleri</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Kalem Ekle
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500">Stok/Hizmet</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-24">Miktar</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-32">Birim Fiyat</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-32 text-right">Toplam</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">
                                                    <input type="hidden" name={`stockId_${index}`} value={item.stockId} />
                                                    <div className="flex gap-2">
                                                        <Input
                                                            readOnly
                                                            value={stocks.find(s => s.id === item.stockId)?.name || ''}
                                                            placeholder="Stok/Hizmet Seçin..."
                                                            className="cursor-pointer bg-slate-50 dark:bg-slate-900 focus:ring-0"
                                                            onClick={() => {
                                                                setActiveLineId(item.id);
                                                                setSearchQuery('');
                                                                setShowSearchDialog(true);
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            className="shrink-0"
                                                            onClick={() => {
                                                                setActiveLineId(item.id);
                                                                setSearchQuery('');
                                                                setShowSearchDialog(true);
                                                            }}
                                                        >
                                                            <Search className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="number"
                                                        name={`quantity_${index}`}
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                                        min="0"
                                                        step="any"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="number"
                                                        name={`unitPrice_${index}`}
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {formatCurrency(item.quantity * item.unitPrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(item.id)}
                                                        className="h-8 w-8 text-red-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <input type="hidden" name="itemsCount" value={items.length} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-slate-900 text-white border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-blue-400" />
                                    Özet
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-slate-400">
                                    <span>Ara Toplam</span>
                                    <span>{formatCurrency(totals.sub)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>KDV Toplamı</span>
                                    <span>{formatCurrency(totals.vat)}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex justify-between text-xl font-bold">
                                    <span>Genel Toplam</span>
                                    <span className="text-blue-400">{formatCurrency(totals.grand)}</span>
                                </div>
                                <div className="pt-6">
                                    <Button type="submit" className="w-full flex items-center justify-center gap-2 h-12 text-md">
                                        <Save className="h-5 w-5" />
                                        Faturayı Kaydet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-2">
                                <CardTitle className="text-sm">Ödeme Planı</CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowInstallments(!showInstallments);
                                        if (!showInstallments && installments.length === 0) generateInstallments();
                                    }}
                                >
                                    {showInstallments ? 'Kapat' : 'Taksitlendir'}
                                </Button>
                            </CardHeader>
                            {showInstallments && (
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        {/* Plan Config */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Peşin Ödenen Tutar</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="h-8 text-xs"
                                                    value={downPayment}
                                                    onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                                                    placeholder="0.00"
                                                />
                                                <input type="hidden" name="paidAmount" value={downPayment} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">Taksit Sayısı</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        className="h-8 text-xs"
                                                        value={installmentCount}
                                                        onChange={(e) => setInstallmentCount(parseInt(e.target.value) || 1)}
                                                        min="1"
                                                        max="24"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-xs"
                                                        onClick={generateInstallments}
                                                    >
                                                        Uygula
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Validation Alert */}
                                        {validationDiff !== 0 && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-3 rounded-lg text-xs space-y-2">
                                                <div className="flex items-center gap-2 font-medium">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Toplam Tutar Uyuşmuyor!
                                                </div>
                                                <p>
                                                    Fatura Toplamı: {formatCurrency(totals.grand)}<br />
                                                    Plan Toplamı: {formatCurrency(planTotal)}<br />
                                                    Fark: {formatCurrency(validationDiff)}
                                                </p>
                                                <div className="flex gap-2 pt-1">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 text-[10px] bg-white dark:bg-slate-900"
                                                        onClick={() => resolveDiff('first')}
                                                    >
                                                        Taksite Ekle (İlk)
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 text-[10px] bg-white dark:bg-slate-900"
                                                        onClick={() => resolveDiff('last')}
                                                    >
                                                        Taksite Ekle (Son)
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Installments List */}
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                            {installments.map((ins, idx) => (
                                                <div key={ins.id} className="flex gap-2 items-center group">
                                                    <span className="text-[10px] w-4 font-bold text-slate-400 group-hover:text-accent transition-colors">{idx + 1}.</span>
                                                    <Input
                                                        type="date"
                                                        className="h-8 text-xs bg-transparent focus:bg-white dark:focus:bg-slate-900 transition-colors w-[110px]"
                                                        value={ins.dueDate}
                                                        onChange={(e) => updateInstallment(ins.id, 'dueDate', e.target.value)}
                                                    />
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs text-[10px]">₺</span>
                                                        <Input
                                                            type="number"
                                                            className="h-8 text-xs bg-transparent focus:bg-white dark:focus:bg-slate-900 transition-colors pl-5 text-right font-medium w-full"
                                                            value={ins.amount}
                                                            onChange={(e) => updateInstallment(ins.id, 'amount', parseFloat(e.target.value))}
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <input type="hidden" name={`ins_date_${idx}`} value={ins.dueDate} />
                                                    <input type="hidden" name={`ins_amount_${idx}`} value={ins.amount} />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const newInstallments = installments.filter(i => i.id !== ins.id);
                                                            setInstallments(newInstallments);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <input type="hidden" name="installmentsCount" value={showInstallments ? installments.length : 0} />
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Açıklama</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    name="description"
                                    rows={4}
                                    className="w-full bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Fatura notu..."
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Quick Add Stock Dialog */}
            <Dialog
                isOpen={showQuickAdd}
                onClose={() => setShowQuickAdd(false)}
                title="Hızlı Stok/Hizmet Ekle"
            >
                <form onSubmit={handleQuickAddSave} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Stok/Hizmet Adı</Label>
                        <Input
                            value={newStock.name}
                            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                            required
                            placeholder="Örn: Danışmanlık Hizmeti"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kodu</Label>
                            <Input
                                value={newStock.code}
                                onChange={(e) => setNewStock({ ...newStock, code: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Türü</Label>
                            <Select
                                value={newStock.type}
                                onChange={(e) => setNewStock({ ...newStock, type: e.target.value as StockType })}
                            >
                                <option value="Hizmet">Hizmet</option>
                                <option value="Ürün">Ürün</option>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Birim Fiyat (KDV Hariç)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={newStock.salePrice}
                                onChange={(e) => setNewStock({ ...newStock, salePrice: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>KDV %</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={newStock.vatRate}
                                onChange={(e) => setNewStock({ ...newStock, vatRate: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowQuickAdd(false)}>İptal</Button>
                        <Button type="submit" disabled={isAddingStock}>
                            {isAddingStock && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kaydet ve Seç
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Stock Search Dialog */}
            <Dialog
                isOpen={showSearchDialog}
                onClose={() => setShowSearchDialog(false)}
                title="Stok/Hizmet Ara"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Stok adı veya kodu ile ara..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg max-h-[300px] overflow-y-auto">
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-accent hover:text-accent hover:bg-accent/10 h-9"
                                onClick={() => {
                                    setShowSearchDialog(false);
                                    setNewStock({ ...newStock, code: `STK-${Math.floor(Math.random() * 10000)}` });
                                    setShowQuickAdd(true);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Yeni Stok/Hizmet Ekle
                            </Button>
                        </div>

                        {stocks
                            .filter(s =>
                                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                s.code.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(s => (
                                <button
                                    key={s.id}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors group"
                                    onClick={() => {
                                        if (activeLineId) {
                                            updateItem(activeLineId, 'stockId', s.id);
                                        }
                                        setShowSearchDialog(false);
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                                                {s.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {s.code} • {s.type}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {formatCurrency(s.salePrice)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        {stocks.filter(s =>
                            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.code.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    Sonuç bulunamadı.
                                </div>
                            )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}
