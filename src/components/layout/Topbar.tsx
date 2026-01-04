'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    Package,
    FileText,
    Truck,
    Wallet,
    Landmark,
    LayoutDashboard,
    Settings,
    User as UserIcon,
    ChevronDown,
    BookOpen,
    Coins,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from '@/models/user';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { logoutAction } from '@/app/actions/auth';
import { useTranslation } from '@/components/providers/LanguageProvider';

export function Topbar({ user }: { user: User }) {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: t('dashboard'), key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: t('customers'), key: 'customers', href: '/customers', icon: Users },
        { name: t('stock_management'), key: 'stock_management', href: '/stock', icon: Package },
        { name: t('invoices'), key: 'invoices', href: '/invoices', icon: FileText },
        { name: t('dispatch_notes'), key: 'dispatch_notes', href: '/dispatch-notes', icon: Truck },
        { name: t('cash'), key: 'cash', href: '/cash', icon: Wallet },
        { name: t('bank'), key: 'bank', href: '/bank', icon: Landmark },
        {
            name: t('definitions'),
            key: 'definitions',
            icon: BookOpen,
            children: [
                { name: t('cash_definitions'), href: '/definitions/cash', icon: Wallet },
                { name: t('bank_definitions'), href: '/definitions/banks', icon: Landmark },
                { name: t('currency_rates'), href: '/definitions/currencies', icon: Coins },
            ]
        }
    ];

    return (
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent shrink-0">
                        {t('app_title')}
                    </h1>

                    <button
                        className="md:hidden p-2 -mr-2 text-slate-500 dark:text-slate-400"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            if (item.children) {
                                const isChildActive = item.children.some(child => pathname.startsWith(child.href));
                                return (
                                    <div key={item.key || item.name} className="relative group">
                                        <button
                                            className={cn(
                                                'px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                                                isChildActive
                                                    ? 'bg-accent/10 text-accent'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-white'
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                            <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform" />
                                        </button>
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                                                        pathname === child.href
                                                            ? "bg-accent/10 text-accent"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent"
                                                    )}
                                                >
                                                    <child.icon className="h-4 w-4" />
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.key || item.name}
                                    href={item.href || '#'}
                                    className={cn(
                                        'px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                                        isActive
                                            ? 'bg-accent/10 text-accent'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-white'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4 border-l border-slate-100 dark:border-slate-800 pl-4">
                    <ThemeToggle />
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">{user.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user.username}</div>
                    </div>
                    <Link
                        href="/settings"
                        title={t('settings')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            pathname === '/settings' ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={() => logoutAction()}
                        title={t('logout')}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <nav className="p-4 space-y-2">
                        {navigation.map((item) => (
                            <div key={item.key || item.name}>
                                {item.children ? (
                                    <div className="space-y-2">
                                        <div className="font-semibold text-sm px-4 py-2 text-slate-500 dark:text-slate-400">
                                            {item.name}
                                        </div>
                                        <div className="pl-4 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={cn(
                                                        "block px-4 py-2 text-sm rounded-lg transition-colors",
                                                        pathname === child.href
                                                            ? "bg-accent/10 text-accent font-medium"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <child.icon className="h-4 w-4" />
                                                        {child.name}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block px-4 py-2 text-sm rounded-lg transition-colors",
                                            (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                                                ? "bg-accent/10 text-accent font-medium"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}
