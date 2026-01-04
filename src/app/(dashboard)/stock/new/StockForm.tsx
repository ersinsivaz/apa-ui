'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createStockAction } from '../actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export function StockForm() {
    const [type, setType] = useState<'Ürün' | 'Hizmet'>('Ürün');

    return (
        <form action={createStockAction}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Stok / Hizmet Detayları</CardTitle>
                    <Link href="/stock">
                        <Button variant="ghost" size="sm" type="button" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Geri Dön
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Stok Kodu</Label>
                            <Input id="code" name="code" placeholder="Örn: STK-001" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tür</Label>
                            <Select
                                id="type"
                                name="type"
                                required
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                            >
                                <option value="Ürün">Ürün</option>
                                <option value="Hizmet">Hizmet</option>
                            </Select>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label htmlFor="name">Stok / Hizmet Adı</Label>
                            <Input id="name" name="name" placeholder="Örn: Kablosuz Mouse veya Danışmanlık Hizmeti" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">Birim</Label>
                            <Select id="unit" name="unit" required>
                                <option value="Adet">Adet</option>
                                <option value="Kg">Kg</option>
                                <option value="Saat">Saat</option>
                                <option value="Metre">Metre</option>
                                <option value="Litre">Litre</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vatRate">KDV Oranı (%)</Label>
                            <Select id="vatRate" name="vatRate" required>
                                <option value="20">20</option>
                                <option value="10">10</option>
                                <option value="1">1</option>
                                <option value="0">0</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salePrice">Satış Fiyatı (TRY)</Label>
                            <Input id="salePrice" name="salePrice" type="number" step="0.01" placeholder="0.00" required />
                        </div>

                        {type === 'Ürün' && (
                            <div className="space-y-2">
                                <Label htmlFor="stockQuantity">Açılış Stoğu</Label>
                                <Input id="stockQuantity" name="stockQuantity" type="number" placeholder="0" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Kaydet
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
