'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';

export function CashHeader() {
    const { t } = useTranslation();

    return (
        <PageHeader
            titleKey="cash_management"
            descriptionKey="cash_description"
        >
            <Link href="/cash/new?type=Giriş">
                <Button className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t('add_collection')}
                </Button>
            </Link>
            <Link href="/cash/new?type=Çıkış">
                <Button variant="outline" className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    {t('add_payment')}
                </Button>
            </Link>
        </PageHeader>
    );
}
