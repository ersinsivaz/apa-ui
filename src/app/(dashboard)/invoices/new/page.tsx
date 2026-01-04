import { customerService } from '@/services/customerService';
import { stockService } from '@/services/stockService';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceType } from '@/models/invoice';

export default async function NewInvoicePage({
    searchParams
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const resolvedSearchParams = await searchParams;
    const type = (resolvedSearchParams.type === 'Alış' ? 'Alış' : 'Satış') as InvoiceType;

    const customers = await customerService.getAllCustomers();
    const stocks = await stockService.getAllStocks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni {type} Faturası</h1>
                    <p className="text-slate-500 dark:text-slate-400">Yeni bir fatura kaydı ve cari/stok hareketi oluşturun.</p>
                </div>
            </div>

            <InvoiceForm
                initialType={type}
                customers={customers}
                stocks={stocks}
            />
        </div>
    );
}
