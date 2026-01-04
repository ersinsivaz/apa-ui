import { Entity } from './types';

export type StockType = 'Ürün' | 'Hizmet';
export type UnitType = 'Adet' | 'Kg' | 'Saat' | 'Metre' | 'Litre';

export interface Stock extends Entity {
    code: string;
    name: string;
    type: StockType;
    unit: UnitType;
    vatRate: number; // e.g., 20
    salePrice: number;
    stockQuantity: number;
}
