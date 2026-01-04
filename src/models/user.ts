export type LayoutPreference = 'sidebar' | 'topbar';
export type ThemePreference = 'light' | 'dark' | 'system';
export type LanguagePreference = 'tr' | 'en' | 'de' | 'fr' | 'es';

export interface UserSettings {
    layout: LayoutPreference;
    theme: ThemePreference;
    accentColor?: string;
    language: LanguagePreference;
}

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    settings: UserSettings;
    createdAt: string;
    updatedAt: string;
}
