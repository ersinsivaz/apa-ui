'use server';

import { invoiceService } from '@/services/invoiceService';
import { stockService } from '@/services/stockService';
import { InvoiceType } from '@/models/invoice';
import { StockType, UnitType } from '@/models/stock';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoiceAction(formData: FormData) {
    const invoiceNo = formData.get('invoiceNo') as string;
    const type = formData.get('type') as InvoiceType;
    const customerId = formData.get('customerId') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const itemsCount = Number(formData.get('itemsCount'));
    const paidAmount = Number(formData.get('paidAmount') || 0);

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
        const stockId = formData.get(`stockId_${i}`) as string;
        const quantity = Number(formData.get(`quantity_${i}`));
        const unitPrice = Number(formData.get(`unitPrice_${i}`));

        if (stockId) {
            items.push({ stockId, quantity, unitPrice });
        }
    }

    if (items.length === 0) {
        throw new Error('En az bir kalem eklemelisiniz.');
    }

    const installmentsCount = Number(formData.get('installmentsCount') || 0);
    const installments = [];
    for (let i = 0; i < installmentsCount; i++) {
        const dueDate = formData.get(`ins_date_${i}`) as string;
        const amount = Number(formData.get(`ins_amount_${i}`));
        if (dueDate && amount) {
            installments.push({ dueDate, amount });
        }
    }

    await invoiceService.createInvoice({
        invoiceNo,
        type,
        customerId,
        date,
        items,
        description,
        installments,
        paidAmount,
    });

    revalidatePath('/invoices');
    revalidatePath('/customers');
    revalidatePath('/stock');
    redirect('/invoices');
}

export async function recordPaymentAction(data: any) {
    const res = await invoiceService.recordPayment(data);
    revalidatePath('/invoices');
    revalidatePath('/cash');
    revalidatePath('/bank');
    revalidatePath('/customers');
    return res;
}

export async function cancelInvoiceAction(id: string) {
    await invoiceService.cancelInvoice(id);
    revalidatePath('/invoices');
    revalidatePath('/customers');
    revalidatePath('/stock');
}

export async function getPaymentsAction(invoiceId: string) {
    return await invoiceService.getPaymentsByInvoiceId(invoiceId);
}

export async function getPaymentSourcesAction() {
    const [cashBoxes, bankAccounts] = await Promise.all([
        invoiceService.getCashBoxes(),
        invoiceService.getBankAccounts()
    ]);
    return { cashBoxes, bankAccounts };
}

export async function createQuickStockAction(data: {
    name: string;
    code: string;
    type: StockType;
    salePrice: number;
    vatRate: number;
}) {
    const newStock = await stockService.createStock({
        ...data,
        unit: 'Adet' as UnitType, // Default
        stockQuantity: 0
    });

    // We don't want to revalidate/redirect extensively here as it's an AJAX-like call
    revalidatePath('/stock');
    return newStock;
}
