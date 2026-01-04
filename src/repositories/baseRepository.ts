import { readJson, writeJson } from '@/lib/db';
import { Entity } from '@/models/types';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseRepository<T extends Entity> {
    protected abstract filename: string;

    async getAll(): Promise<T[]> {
        return await readJson<T>(this.filename);
    }

    async getById(id: string): Promise<T | undefined> {
        const items = await this.getAll();
        return items.find((item) => item.id === id);
    }

    async create(item: Omit<T, keyof Entity>): Promise<T> {
        const items = await this.getAll();
        const newItem = {
            ...item,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as T;

        items.push(newItem);
        await writeJson(this.filename, items);
        return newItem;
    }

    async update(id: string, updates: Partial<T>): Promise<T | undefined> {
        const items = await this.getAll();
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return undefined;

        const updatedItem = {
            ...items[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        items[index] = updatedItem;
        await writeJson(this.filename, items);
        return updatedItem;
    }

    async delete(id: string): Promise<boolean> {
        const items = await this.getAll();
        const initialLength = items.length;
        const filteredItems = items.filter((item) => item.id !== id);

        if (filteredItems.length === initialLength) return false;

        await writeJson(this.filename, filteredItems);
        return true;
    }
    async getPaginated(page: number, limit: number, query?: string): Promise<{ data: T[], total: number }> {
        const items = await this.getAll();

        // Filter first if query exists
        let filteredItems = items;
        if (query) {
            const q = query.toLowerCase();
            filteredItems = items.filter(item =>
                ((item as any).name && String((item as any).name).toLowerCase().includes(q)) ||
                ((item as any).code && String((item as any).code).toLowerCase().includes(q))
            );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const slicedItems = filteredItems.slice(startIndex, endIndex);

        return {
            data: slicedItems,
            total: filteredItems.length
        };
    }
}
