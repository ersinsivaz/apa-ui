import { invoiceService } from '@/services/invoiceService';
import { InvoiceList } from './InvoiceList';
import { InvoicesHeader } from './InvoicesHeader';

export default async function InvoicesPage() {
    const invoices = await invoiceService.getAllInvoices();

    return (
        <div className="space-y-6">
            <InvoicesHeader />
            <InvoiceList initialInvoices={invoices} />
        </div>
    );
}
