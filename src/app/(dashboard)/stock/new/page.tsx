import { StockForm } from './StockForm';

export default function NewStockPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni Kayıt Ekle</h1>
                <p className="text-slate-500 dark:text-slate-400">Yeni bir ürün veya hizmet tanımlayın.</p>
            </div>

            <div className="max-w-2xl">
                <StockForm />
            </div>
        </div>
    );
}
