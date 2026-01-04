import { stockService } from '@/services/stockService';
import { PageHeader } from '@/components/layout/PageHeader';
import { StockList } from './StockList';

export default async function StocksPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string, q?: string }>
}) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const query = resolvedSearchParams.q || '';
    const limit = 10;

    const { data: stocks, total } = await stockService.getPaginatedStocks(page, limit, query);

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="stock_management"
                descriptionKey="stock_description"
                buttonKey="new_stock"
                buttonHref="/stock/new"
            />
            <StockList
                stocks={stocks}
                total={total}
                page={page}
                limit={limit}
                query={query}
            />
        </div>
    );
}
