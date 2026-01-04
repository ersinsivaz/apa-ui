'use server';

import { stockService } from '@/services/stockService';
import { StockType, UnitType } from '@/models/stock';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStockAction(formData: FormData) {
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as StockType;
    const unit = formData.get('unit') as UnitType;
    const vatRate = Number(formData.get('vatRate'));
    const salePrice = Number(formData.get('salePrice'));
    const stockQuantity = Number(formData.get('stockQuantity')) || 0;

    try {
        await stockService.createStock({
            code,
            name,
            type,
            unit,
            vatRate,
            salePrice,
            stockQuantity,
        });
    } catch (error) {
        // Handle error (e.g., return as object for client handling)
        console.error(error);
    }

    revalidatePath('/stock');
    redirect('/stock');
}
