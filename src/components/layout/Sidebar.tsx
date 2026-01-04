'use client';

import { useState, useEffect } from 'react';
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
    LogOut,
    ChevronDown,
    Settings2,
    Coins,
    BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { User } from '@/models/user';
import { logoutAction } from '@/app/actions/auth';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface SidebarProps {
    user: User;
    onCloseMobile?: () => void;
}

export function Sidebar({ user, onCloseMobile }: SidebarProps) {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

    useEffect(() => {
        // Automatically expand if a child is active
        navigation.forEach(item => {
            if (item.children?.some(child => pathname.startsWith(child.href))) {
                setExpandedItems(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
            }
        });
    }, [pathname]);

    const toggleExpand = (name: string) => {
        setExpandedItems(prev =>
            prev.includes(name)
                ? prev.filter(i => i !== name)
                : [...prev, name]
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent mb-6">
                    {t('app_title')}
                </h1>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-white shrink-0">
                            <UserIcon className="h-6 w-6" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-semibold truncate dark:text-white">{user.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-tighter truncate">{user.username}</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Link
                            href="/settings"
                            title={t('settings')}
                            className={cn(
                                "p-2 rounded-lg transition-colors shrink-0",
                                pathname === '/settings'
                                    ? "bg-accent text-white shadow-md shadow-accent/20"
                                    : "text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-white"
                            )}
                        >
                            <Settings className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={() => logoutAction()}
                            title={t('logout')}
                            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors shrink-0"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
                {navigation.map((item) => {
                    if (item.children) {
                        const isChildActive = item.children.some(child => pathname.startsWith(child.href));
                        const isExpanded = expandedItems.includes(item.name);

                        return (
                            <div key={item.key || item.name} className="space-y-1">
                                <button
                                    onClick={() => toggleExpand(item.name)}
                                    className={cn(
                                        'w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer',
                                        isChildActive || isExpanded
                                            ? 'text-accent bg-accent/10'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent dark:hover:text-white'
                                    )}
                                >
                                    <div className="flex items-center">
                                        <item.icon
                                            className={cn(
                                                'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                                                isChildActive || isExpanded ? 'text-accent' : 'text-slate-400 group-hover:text-accent dark:group-hover:text-white'
                                            )}
                                        />
                                        {item.name}
                                    </div>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded ? "rotate-0" : "-rotate-90")} />
                                </button>
                                <div className={cn(
                                    "pl-4 space-y-1 overflow-hidden transition-all duration-300",
                                    isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                                )}>
                                    {item.children.map((child) => {
                                        const isChildItemActive = pathname === child.href;
                                        return (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                onClick={onCloseMobile}
                                                className={cn(
                                                    'flex items-center px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200 group',
                                                    isChildItemActive
                                                        ? 'bg-accent text-white shadow-md'
                                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent dark:hover:text-white'
                                                )}
                                            >
                                                <child.icon
                                                    className={cn(
                                                        'mr-3 h-4 w-4 flex-shrink-0 transition-colors',
                                                        isChildItemActive ? 'text-white' : 'text-slate-400 group-hover:text-accent dark:group-hover:text-white'
                                                    )}
                                                />
                                                {child.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.key || item.name}
                            href={item.href || '#'}
                            onClick={onCloseMobile}
                            className={cn(
                                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group',
                                isActive
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent dark:hover:text-white'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-accent dark:group-hover:text-white'
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Antigravity v1.0</span>
                <ThemeToggle />
            </div>
        </div>
    );
}
