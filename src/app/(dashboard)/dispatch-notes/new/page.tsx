import { customerService } from '@/services/customerService';
import { stockService } from '@/services/stockService';
import { DispatchNoteForm } from './DispatchNoteForm';

export default async function NewDispatchNotePage() {
    const customers = await customerService.getAllCustomers();
    const stocks = await stockService.getAllStocks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni İrsaliye</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sevkiyat kaydı oluşturarak stok çıkışını gerçekleştirin.</p>
                </div>
                <Link href="/dispatch-notes">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Vazgeç
                    </Button>
                </Link>
            </div>

            <DispatchNoteForm
                customers={customers}
                stocks={stocks}
            />
        </div>
    );
}

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
