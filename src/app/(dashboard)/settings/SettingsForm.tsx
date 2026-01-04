'use client';

import { useState } from 'react';
import { User, UserSettings } from '@/models/user';
import { updateUserSettingsAction } from '@/app/(dashboard)/settings/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Layout, Moon, Sun, Monitor, CheckCircle2, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { Globe } from 'lucide-react';
import { LanguageCode } from '@/lib/translations';

interface SettingsFormProps {
    user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
    const [settings, setSettings] = useState<UserSettings>(user.settings);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { t, setLanguage, language: currentLanguage } = useTranslation();

    // Use theme from next-themes if it exists, otherwise use user settings
    const currentTheme = theme || user.settings.theme;

    const handleSave = async (newSettings: Partial<UserSettings>) => {
        setIsSaving(true);
        const updated = { ...settings, ...newSettings };
        setSettings(updated);

        if (newSettings.theme) {
            setTheme(newSettings.theme);
        }

        if (newSettings.accentColor) {
            document.documentElement.setAttribute('data-accent', newSettings.accentColor);
        }

        if (newSettings.language) {
            setLanguage(newSettings.language);
        }

        await updateUserSettingsAction(user.id, updated);
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Layout Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        {t('appearance_layout')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleSave({ layout: 'sidebar' })}
                        className={cn(
                            "group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                            settings.layout === 'sidebar'
                                ? "border-accent bg-accent/10"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                        )}
                    >
                        <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded flex gap-1 p-1">
                            <div className="w-1/4 h-full bg-accent rounded-sm" />
                            <div className="flex-1 h-full bg-slate-200 dark:bg-slate-700 rounded-sm" />
                        </div>
                        <span className="text-sm font-medium">{t('sidebar')}</span>
                        {settings.layout === 'sidebar' && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-accent" />}
                    </button>

                    <button
                        onClick={() => handleSave({ layout: 'topbar' })}
                        className={cn(
                            "group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                            settings.layout === 'topbar'
                                ? "border-accent bg-accent/10"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                        )}
                    >
                        <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded flex flex-col gap-1 p-1">
                            <div className="w-full h-1/4 bg-accent rounded-sm" />
                            <div className="w-full flex-1 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                        </div>
                        <span className="text-sm font-medium">{t('topbar')}</span>
                        {settings.layout === 'topbar' && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-accent" />}
                    </button>
                </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        {t('color_theme')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    {[
                        { id: 'light', name: t('light'), icon: Sun },
                        { id: 'dark', name: t('dark'), icon: Moon },
                        { id: 'system', name: t('system'), icon: Monitor },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleSave({ theme: t.id as any })}
                            className={cn(
                                "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                                currentTheme === t.id
                                    ? "border-accent bg-accent/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            )}
                        >
                            <t.icon className={cn("h-6 w-6", currentTheme === t.id ? "text-accent" : "text-slate-400")} />
                            <span className="text-sm font-medium">{t.name}</span>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Accent Color Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        {t('accent_color')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[
                        { id: 'blue', name: t('blue'), hex: '#2563eb' },
                        { id: 'green', name: t('green'), hex: '#16a34a' },
                        { id: 'orange', name: t('orange'), hex: '#ea580c' },
                        { id: 'red', name: t('red'), hex: '#dc2626' },
                        { id: 'purple', name: t('purple'), hex: '#9333ea' },
                        { id: 'emerald', name: t('emerald'), hex: '#059669' },
                    ].map((c) => (
                        <button
                            key={c.id}
                            onClick={() => handleSave({ accentColor: c.id })}
                            className={cn(
                                "group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                settings.accentColor === c.id
                                    ? "border-accent bg-accent/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            )}
                        >
                            <div
                                className="h-8 w-8 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: c.hex }}
                            />
                            <span className="text-xs font-medium">{c.name}</span>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {t('language')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                        { id: 'tr', name: t('turkish'), flag: '🇹🇷' },
                        { id: 'en', name: t('english'), flag: '🇺🇸' },
                        { id: 'de', name: t('german'), flag: '🇩🇪' },
                        { id: 'fr', name: t('french'), flag: '🇫🇷' },
                        { id: 'es', name: t('spanish'), flag: '🇪🇸' },
                    ].map((l) => (
                        <button
                            key={l.id}
                            onClick={() => handleSave({ language: l.id as LanguageCode })}
                            className={cn(
                                "group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                settings.language === l.id
                                    ? "border-accent bg-accent/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            )}
                        >
                            <span className="text-2xl">{l.flag}</span>
                            <span className="text-xs font-medium">{l.name}</span>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {showSuccess && (
                <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4">
                    <CheckCircle2 className="h-5 w-5" />
                    {t('success_message')}
                </div>
            )}
        </div>
    );
}
