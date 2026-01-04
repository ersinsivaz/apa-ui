'use server';

import { userService } from '@/services/userService';
import { UserSettings } from '@/models/user';
import { revalidatePath } from 'next/cache';

export async function updateUserSettingsAction(userId: string, settings: Partial<UserSettings>) {
    await userService.updateUserSettings(userId, settings);
    revalidatePath('/', 'layout');
}
