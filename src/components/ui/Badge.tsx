import { cn } from '@/lib/utils';

export function Badge({
    children,
    variant = 'default',
    className
}: {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
    className?: string;
}) {
    const variants = {
        default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        outline: 'border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400',
    };

    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
            {children}
        </span>
    );
}
