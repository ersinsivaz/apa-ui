import { stockRepository } from '@/repositories/stockRepository';
import { Stock, StockType, UnitType } from '@/models/stock';

export class StockService {
    async getAllStocks() {
        return await stockRepository.getAll();
    }

    async getPaginatedStocks(page: number, limit: number, query?: string) {
        return await stockRepository.getPaginated(page, limit, query);
    }

    async getStockById(id: string) {
        return await stockRepository.getById(id);
    }

    async createStock(data: {
        code: string;
        name: string;
        type: StockType;
        unit: UnitType;
        vatRate: number;
        salePrice: number;
        stockQuantity: number;
    }) {
        // Check if code already exists
        const existing = await stockRepository.findByCode(data.code);
        if (existing) {
            throw new Error('Bu stok kodu zaten kullanımda.');
        }

        return await stockRepository.create({
            ...data,
            stockQuantity: data.type === 'Hizmet' ? 0 : data.stockQuantity,
        });
    }

    async updateStock(id: string, updates: Partial<Stock>) {
        return await stockRepository.update(id, updates);
    }

    async adjustStock(id: string, delta: number) {
        return await stockRepository.updateQuantity(id, delta);
    }

    async deleteStock(id: string) {
        return await stockRepository.delete(id);
    }
}

export const stockService = new StockService();
