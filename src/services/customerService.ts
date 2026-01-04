import { customerRepository } from '@/repositories/customerRepository';
import { Customer, CustomerType } from '@/models/customer';
import { invoiceRepository } from '@/repositories/invoiceRepository';
import { dispatchNoteRepository } from '@/repositories/dispatchNoteRepository';

export class CustomerService {
    async getAllCustomers() {
        return await customerRepository.getAll();
    }

    async getCustomerById(id: string) {
        return await customerRepository.getById(id);
    }

    async createCustomer(data: {
        type: CustomerType;
        name: string;
        taxNumber?: string;
        phone?: string;
        email?: string;
        address?: string;
    }) {
        return await customerRepository.create({
            ...data,
            balance: 0,
            isActive: true,
        });
    }

    async updateCustomer(id: string, updates: Partial<Customer>) {
        return await customerRepository.update(id, updates);
    }

    async deactivateCustomer(id: string) {
        // In the future, check for open invoices here
        return await customerRepository.update(id, { isActive: false });
    }

    async deleteCustomer(id: string) {
        // Check for invoices
        const invoices = await invoiceRepository.getInvoicesByCustomerId(id);
        const dispatchNotes = await dispatchNoteRepository.getDispatchNotesByCustomerId(id);

        if (invoices.length > 0 || dispatchNotes.length > 0) {
            let message = 'Müşteriye ait hareketler bulunduğu için silinemez.';
            const details = [];
            if (invoices.length > 0) details.push(`${invoices.length} adet fatura`);
            if (dispatchNotes.length > 0) details.push(`${dispatchNotes.length} adet irsaliye`);

            throw new Error(`${message} (${details.join(', ')})`);
        }

        return await customerRepository.delete(id);
    }
}

export const customerService = new CustomerService();
