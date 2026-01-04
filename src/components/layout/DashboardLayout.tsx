import { userService } from '@/services/userService';
import { AccentProvider } from '@/components/providers/AccentProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ClientLayout } from './ClientLayout';

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await userService.getCurrentUser();

    // Default fallback if no user
    if (!user) return <>{children}</>;

    const isSidebar = user.settings.layout === 'sidebar';

    return (
        <div
            className="min-h-screen bg-background text-foreground transition-colors duration-300"
            data-accent={user.settings.accentColor || 'blue'}
        >
            <LanguageProvider initialLanguage={user.settings.language || 'tr'}>
                <AccentProvider settings={user.settings} />
                <ClientLayout user={user} isSidebarLayout={isSidebar}>
                    {children}
                </ClientLayout>
            </LanguageProvider>
        </div>
    );
}
