import { userRepository } from '@/repositories/userRepository';
import { User, UserSettings } from '@/models/user';

export class UserService {
    // For demo purposes, we always return the first user as the "logged in" user
    async getCurrentUser(): Promise<User | null> {
        const users = await userRepository.getAll();
        return users[0] || null;
    }

    async updateUserSettings(userId: string, settings: Partial<UserSettings>) {
        const user = await userRepository.getById(userId);
        if (!user) throw new Error('User not found');

        const updatedSettings = { ...user.settings, ...settings };
        return await userRepository.update(userId, { settings: updatedSettings });
    }
}

export const userService = new UserService();
