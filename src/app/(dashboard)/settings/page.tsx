import { userService } from '@/services/userService';
import { SettingsForm } from './SettingsForm';
import { PageHeader } from '@/components/layout/PageHeader';

export default async function SettingsPage() {
    const user = await userService.getCurrentUser();

    if (!user) return null;

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="user_settings"
                descriptionKey="settings_description"
            />
            <SettingsForm user={user} />
        </div>
    );
}
