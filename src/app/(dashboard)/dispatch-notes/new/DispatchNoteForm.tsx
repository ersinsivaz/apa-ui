'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createDispatchNoteAction } from '@/app/(dashboard)/dispatch-notes/actions';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Customer } from '@/models/customer';
import { Stock } from '@/models/stock';

interface DispatchNoteFormProps {
    customers: Customer[];
    stocks: Stock[];
}

export function DispatchNoteForm({ customers, stocks }: DispatchNoteFormProps) {
    const [items, setItems] = useState([
        { id: Math.random().toString(), stockId: '', quantity: 1 }
    ]);

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), stockId: '', quantity: 1 }]);
    };

    const removeItem = (id: string) => {
        if (items.length === 1) return;
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: string, field: string, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <form action={createDispatchNoteAction} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>İrsaliye Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dispatchNo">İrsaliye No</Label>
                                    <Input id="dispatchNo" name="dispatchNo" placeholder="IRS-2024-001" required />
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
                            <CardTitle className="text-md">Sevkiyat Kalemleri</CardTitle>
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
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-32">Miktar</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <input type="hidden" name={`stockId_${index}`} value={item.stockId} />
                                                <Select
                                                    value={item.stockId}
                                                    onChange={(e) => updateItem(item.id, 'stockId', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Seçin...</option>
                                                    {stocks.filter(s => s.type === 'Ürün').map(s => (
                                                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                                    ))}
                                                </Select>
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
                    <Card>
                        <CardContent className="pt-6">
                            <Button type="submit" className="w-full flex items-center justify-center gap-2 h-12 text-md">
                                <Save className="h-5 w-5" />
                                İrsaliyeyi Kaydet
                            </Button>
                            <p className="mt-4 text-xs text-slate-500 text-center">
                                Kaydettiğinizde stok miktarları otomatik olarak düşecektir.
                            </p>
                        </CardContent>
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
                                placeholder="Sevkiyat notu..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
