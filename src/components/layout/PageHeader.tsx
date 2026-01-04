'use client';

import { useTranslation } from '@/components/providers/LanguageProvider';
import { TranslationKey } from '@/lib/translations';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    titleKey: TranslationKey;
    descriptionKey: TranslationKey;
    buttonKey?: TranslationKey;
    buttonHref?: string;
    children?: React.ReactNode;
}

export function PageHeader({ titleKey, descriptionKey, buttonKey, buttonHref, children }: PageHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t(titleKey)}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t(descriptionKey)}</p>
            </div>
            <div className="flex items-center gap-2">
                {children}
                {buttonKey && buttonHref && (
                    <Link href={buttonHref}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {t(buttonKey)}
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
