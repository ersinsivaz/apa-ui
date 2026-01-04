import { stockService } from '@/services/stockService';
import { PageHeader } from '@/components/layout/PageHeader';
import { StockList } from './StockList';

export default async function StocksPage() {
    const stocks = await stockService.getAllStocks();

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="stock_management"
                descriptionKey="stock_description"
                buttonKey="new_stock"
                buttonHref="/stock/new"
            />
            <StockList stocks={stocks} />
        </div>
    );
}
