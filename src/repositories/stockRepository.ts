import { BaseRepository } from './baseRepository';
import { Stock } from '@/models/stock';

export class StockRepository extends BaseRepository<Stock> {
    protected filename = 'stocks';

    async findByCode(code: string): Promise<Stock | undefined> {
        const stocks = await this.getAll();
        return stocks.find((stock) => stock.code === code);
    }

    async updateQuantity(id: string, delta: number): Promise<Stock | undefined> {
        const stock = await this.getById(id);
        if (!stock) return undefined;

        // Services should not have stock tracking
        if (stock.type === 'Hizmet') return stock;

        return await this.update(id, {
            stockQuantity: stock.stockQuantity + delta
        });
    }
}

export const stockRepository = new StockRepository();
