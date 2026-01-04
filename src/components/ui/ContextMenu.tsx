'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    items: {
        label: string;
        icon: React.ElementType;
        onClick: () => void;
        variant?: 'default' | 'danger';
    }[];
}

export function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Ensure menu stays within screen bounds
    const [style, setStyle] = useState<React.CSSProperties>({ left: x, top: y });

    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            let newX = x;
            let newY = y;

            if (x + rect.width > window.innerWidth) {
                newX = window.innerWidth - rect.width - 10;
            }
            if (y + rect.height > window.innerHeight) {
                newY = window.innerHeight - rect.height - 10;
            }

            setStyle({ left: newX, top: newY });
        }
    }, [x, y]);

    return (
        <div
            ref={menuRef}
            className="fixed z-[100] min-w-[200px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-100"
            style={style}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                        item.variant === 'danger'
                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent dark:hover:text-white"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
}
