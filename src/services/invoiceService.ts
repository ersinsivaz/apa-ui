import { invoiceRepository } from '@/repositories/invoiceRepository';
import { paymentRepository } from '@/repositories/paymentRepository';
import { customerService } from './customerService';
import { stockService } from './stockService';
import { financeService } from './financeService';
import { Invoice, InvoiceType, InvoiceItem, Payment, Installment } from '@/models/invoice';

export class InvoiceService {
    async getAllInvoices() {
        return await invoiceRepository.getAll();
    }

    async getInvoiceById(id: string) {
        return await invoiceRepository.getById(id);
    }

    async createInvoice(data: {
        invoiceNo: string;
        type: InvoiceType;
        customerId: string;
        date: string;
        items: {
            stockId: string;
            quantity: number;
            unitPrice: number;
        }[];
        description?: string;
        installments?: { dueDate: string; amount: number }[];
        paidAmount?: number;
    }) {
        // 1. Fetch customer and stock details
        const customer = await customerService.getCustomerById(data.customerId);
        if (!customer) throw new Error('Müşteri bulunamadı.');

        let subTotal = 0;
        let vatTotal = 0;
        const invoiceItems: InvoiceItem[] = [];

        for (const itemData of data.items) {
            const stock = await stockService.getStockById(itemData.stockId);
            if (!stock) throw new Error(`Stok bulunamadı: ${itemData.stockId}`);

            const lineSubTotal = itemData.quantity * itemData.unitPrice;
            const lineVatTotal = (lineSubTotal * stock.vatRate) / 100;

            invoiceItems.push({
                stockId: stock.id,
                stockName: stock.name,
                quantity: itemData.quantity,
                unitPrice: itemData.unitPrice,
                vatRate: stock.vatRate,
                vatTotal: lineVatTotal,
                lineTotal: lineSubTotal + lineVatTotal,
            });

            subTotal += lineSubTotal;
            vatTotal += lineVatTotal;

            // 2. Update stock quantity
            const stockDelta = data.type === 'Satış' ? -itemData.quantity : itemData.quantity;
            await stockService.adjustStock(stock.id, stockDelta);
        }

        const grandTotal = subTotal + vatTotal;

        // 3. Update customer balance
        // Sales: Customer owes us more (balance improves from our perspective)
        // Purchase: We owe them more (balance decreases from our perspective)
        const balanceDelta = data.type === 'Satış' ? grandTotal : -grandTotal;
        await customerService.updateCustomer(customer.id, {
            balance: customer.balance + balanceDelta,
        });

        // 4. Create invoice record
        return await invoiceRepository.create({
            invoiceNo: data.invoiceNo,
            type: data.type,
            customerId: customer.id,
            customerName: customer.name,
            date: data.date,
            items: invoiceItems,
            subTotal,
            vatTotal,
            grandTotal,
            paidAmount: data.paidAmount || 0,
            status: 'Açık',
            description: data.description,
            installments: data.installments?.map(ins => ({
                id: Math.random().toString(36).substr(2, 9),
                invoiceId: '', // Will be set by repository or we can leave it
                dueDate: ins.dueDate,
                amount: ins.amount,
                status: 'Bekliyor',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }))
        });
    }

    async recordPayment(data: {
        invoiceId: string;
        amount: number;
        date: string;
        paymentMethod: 'Kasa' | 'Banka';
        sourceId: string;
        sourceName: string;
        description?: string;
        installmentId?: string;
    }) {
        const invoice = await invoiceRepository.getById(data.invoiceId);
        if (!invoice) throw new Error('Fatura bulunamadı.');

        // 1. Create payment record
        const payment = await paymentRepository.create({
            invoiceId: data.invoiceId,
            amount: data.amount,
            date: data.date,
            paymentMethod: data.paymentMethod,
            sourceId: data.sourceId,
            sourceName: data.sourceName,
            description: data.description
        });

        // 2. Update invoice paid amount and status
        const newPaidAmount = invoice.paidAmount + data.amount;
        let newStatus = invoice.status;
        if (newPaidAmount >= invoice.grandTotal) {
            newStatus = 'Ödendi';
        } else if (newPaidAmount > 0) {
            newStatus = 'Kısmi Ödendi';
        }

        // 3. Update installments if applicable
        const updatedInstallments = invoice.installments?.map(ins => {
            if (ins.id === data.installmentId) {
                return { ...ins, status: 'Ödendi' as const, paymentId: payment.id };
            }
            return ins;
        });

        await invoiceRepository.update(data.invoiceId, {
            paidAmount: newPaidAmount,
            status: newStatus,
            installments: updatedInstallments
        });

        // 4. Update customer balance
        const customer = await customerService.getCustomerById(invoice.customerId);
        if (customer) {
            const balanceDelta = invoice.type === 'Satış' ? -data.amount : data.amount;
            await customerService.updateCustomer(invoice.customerId, {
                balance: customer.balance + balanceDelta
            });
        }

        // 5. Update Finance (Cash/Bank)
        if (data.paymentMethod === 'Kasa') {
            await financeService.createCashTransaction({
                type: invoice.type === 'Satış' ? 'Giriş' : 'Çıkış',
                amount: data.amount,
                date: data.date,
                description: data.description || `${invoice.invoiceNo} nolu fatura tahsilatı`,
                relatedInvoiceId: invoice.id
            });
        } else {
            await financeService.createBankTransaction({
                bankAccountId: data.sourceId,
                type: invoice.type === 'Satış' ? 'Gelen Havale' : 'Giden Havale',
                amount: data.amount,
                date: data.date,
                description: data.description || `${invoice.invoiceNo} nolu fatura ödemesi`,
                relatedInvoiceId: invoice.id
            });
        }

        return payment;
    }

    async getPaymentsByInvoiceId(invoiceId: string) {
        return await paymentRepository.getByInvoiceId(invoiceId);
    }

    async getCashBoxes() {
        const { definitionService } = await import('./definitionService');
        return await definitionService.getCashBoxes();
    }

    async getBankAccounts() {
        return await financeService.getAllBankAccounts();
    }

    async cancelInvoice(id: string) {
        const invoice = await invoiceRepository.getById(id);
        if (!invoice || invoice.status === 'İptal') return null;

        // Reverse customer balance
        const customer = await customerService.getCustomerById(invoice.customerId);
        if (customer) {
            const balanceDelta = invoice.type === 'Satış' ? -invoice.grandTotal : invoice.grandTotal;
            await customerService.updateCustomer(customer.id, {
                balance: customer.balance + balanceDelta,
            });
        }

        // Reverse stock quantities
        for (const item of invoice.items) {
            const stockDelta = invoice.type === 'Satış' ? item.quantity : -item.quantity;
            await stockService.adjustStock(item.stockId, stockDelta);
        }

        return await invoiceRepository.update(id, { status: 'İptal' });
    }
}

export const invoiceService = new InvoiceService();
