'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-9 w-9" />; // Placeholder to avoid layout shift
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
            ) : (
                <Moon className="h-4 w-4 text-slate-400" />
            )}
        </Button>
    );
}
