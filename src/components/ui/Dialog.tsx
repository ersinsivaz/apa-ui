import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children, footer }: DialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                </div>

                <div className="px-6 py-4">
                    {description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
                    )}
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
