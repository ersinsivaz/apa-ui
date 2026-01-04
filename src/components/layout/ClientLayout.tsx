'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { User } from '@/models/user';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface ClientLayoutProps {
    children: React.ReactNode;
    user: User;
    isSidebarLayout: boolean;
}

export function ClientLayout({ children, user, isSidebarLayout }: ClientLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useTranslation();

    if (isSidebarLayout) {
        return (
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Mobile Header for Sidebar Mode */}
                <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 z-40">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="font-bold ml-3 text-lg bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
                        {t('app_title')}
                    </span>
                </header>

                {/* Sidebar Backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:inset-auto lg:flex lg:flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                    sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                )}>
                    <Sidebar user={user} onCloseMobile={() => setSidebarOpen(false)} />
                </div>

                {/* Main Content */}
                <main className="flex-1 min-w-0 pt-16 lg:pt-0">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Topbar user={user} />
            <main className="pt-16">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
