import { BaseRepository } from './baseRepository';
import { User } from '@/models/user';

export class UserRepository extends BaseRepository<User> {
    protected filename = 'users';

    async findByUsername(username: string): Promise<User | undefined> {
        const users = await this.getAll();
        return users.find(u => u.username === username);
    }
}

export const userRepository = new UserRepository();
