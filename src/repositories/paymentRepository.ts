import { Payment } from '@/models/invoice';
import { BaseRepository } from './baseRepository';

class PaymentRepository extends BaseRepository<Payment> {
    protected filename = 'payments.json';

    async getByInvoiceId(invoiceId: string): Promise<Payment[]> {
        const all = await this.getAll();
        return all.filter(p => p.invoiceId === invoiceId);
    }
}

export const paymentRepository = new PaymentRepository();
