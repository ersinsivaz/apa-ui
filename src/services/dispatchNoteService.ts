import { dispatchNoteRepository } from '@/repositories/dispatchNoteRepository';
import { customerService } from './customerService';
import { stockService } from './stockService';
import { DispatchNote } from '@/models/dispatchNote';

export class DispatchNoteService {
    async getAllDispatchNotes() {
        return await dispatchNoteRepository.getAll();
    }

    async createDispatchNote(data: {
        dispatchNo: string;
        customerId: string;
        date: string;
        items: {
            stockId: string;
            quantity: number;
        }[];
        description?: string;
    }) {
        const customer = await customerService.getCustomerById(data.customerId);
        if (!customer) throw new Error('Müşteri bulunamadı.');

        const noteItems = [];
        for (const itemData of data.items) {
            const stock = await stockService.getStockById(itemData.stockId);
            if (!stock) throw new Error(`Stok bulunamadı: ${itemData.stockId}`);

            noteItems.push({
                stockId: stock.id,
                stockName: stock.name,
                quantity: itemData.quantity,
            });

            // Update stock quantity (decrease on shipment)
            await stockService.adjustStock(stock.id, -itemData.quantity);
        }

        return await dispatchNoteRepository.create({
            dispatchNo: data.dispatchNo,
            customerId: customer.id,
            customerName: customer.name,
            date: data.date,
            items: noteItems,
            linkedInvoiceId: null,
            description: data.description,
        });
    }

    async linkToInvoice(dispatchNoteId: string, invoiceId: string) {
        return await dispatchNoteRepository.update(dispatchNoteId, {
            linkedInvoiceId: invoiceId
        });
    }
}

export const dispatchNoteService = new DispatchNoteService();
