'use client';

import { useEffect } from 'react';
import { UserSettings } from '@/models/user';

export function AccentProvider({ settings }: { settings: UserSettings }) {
    useEffect(() => {
        if (settings.accentColor) {
            document.documentElement.setAttribute('data-accent', settings.accentColor);
        } else {
            document.documentElement.setAttribute('data-accent', 'blue');
        }
    }, [settings.accentColor]);

    return null;
}
