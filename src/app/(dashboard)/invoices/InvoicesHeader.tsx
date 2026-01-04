'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';

export function InvoicesHeader() {
    const { t } = useTranslation();

    return (
        <PageHeader
            titleKey="invoices"
            descriptionKey="invoices_description"
        >
            <Link href="/invoices/new?type=Satış">
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('new_sales_invoice')}
                </Button>
            </Link>
            <Link href="/invoices/new?type=Alış">
                <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('new_purchase_invoice')}
                </Button>
            </Link>
        </PageHeader>
    );
}
