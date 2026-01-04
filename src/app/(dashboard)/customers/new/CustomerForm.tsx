'use client';

import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createCustomerAction, updateCustomerAction } from '@/app/(dashboard)/customers/actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Customer } from '@/models/customer';

interface CustomerFormProps {
    initialData?: Customer;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
    const action = initialData
        ? updateCustomerAction.bind(null, initialData.id)
        : createCustomerAction;

    return (
        <form action={action}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{initialData ? 'Müşteri Düzenle' : 'Yeni Müşteri'}</CardTitle>
                    <Link href="/customers">
                        <Button variant="ghost" size="sm" type="button" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Geri Dön
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Müşteri Adı / Ünvanı</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={initialData?.name}
                                placeholder="Örn: Ahmet Yılmaz veya ABC Ltd. Şti."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Müşteri Tipi</Label>
                            <Select id="type" name="type" defaultValue={initialData?.type || 'Bireysel'} required>
                                <option value="Bireysel">Bireysel</option>
                                <option value="Kurumsal">Kurumsal</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxNumber">Vergi / T.C. No</Label>
                            <Input
                                id="taxNumber"
                                name="taxNumber"
                                defaultValue={initialData?.taxNumber}
                                placeholder="10 veya 11 haneli numara"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={initialData?.phone}
                                placeholder="05xx xxx xx xx"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={initialData?.email}
                                placeholder="ornek@mail.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Adres</Label>
                            <Input
                                id="address"
                                name="address"
                                defaultValue={initialData?.address}
                                placeholder="Açık adres bilgisi"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            {initialData ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
