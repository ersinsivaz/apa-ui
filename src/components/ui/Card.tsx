import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden', className)}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('p-6 border-b border-slate-200 dark:border-slate-800', className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-white', className)}>{children}</h3>;
}
