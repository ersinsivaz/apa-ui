import { BaseRepository } from './baseRepository';
import { Invoice } from '@/models/invoice';

export class InvoiceRepository extends BaseRepository<Invoice> {
    protected filename = 'invoices';

    async findByInvoiceNo(invoiceNo: string): Promise<Invoice | undefined> {
        const invoices = await this.getAll();
        return invoices.find((invoice) => invoice.invoiceNo === invoiceNo);
    }

    async getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
        const invoices = await this.getAll();
        return invoices.filter((invoice) => invoice.customerId === customerId);
    }
}

export const invoiceRepository = new InvoiceRepository();
