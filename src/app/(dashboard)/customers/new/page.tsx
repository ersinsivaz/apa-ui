import { CustomerForm } from './CustomerForm';

export default function NewCustomerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni Müşteri Ekle</h1>
                <p className="text-slate-500 dark:text-slate-400">Sisteme yeni bir cari hesap ekleyin.</p>
            </div>

            <div className="max-w-2xl">
                <CustomerForm />
            </div>
        </div>
    );
}
