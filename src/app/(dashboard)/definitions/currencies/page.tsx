import { definitionService } from '@/services/definitionService';
import { CurrencyList } from './CurrencyList';
import { PageHeader } from '@/components/layout/PageHeader';

export default async function CurrencyDefinitionsPage() {
    const exchangeRates = await definitionService.getExchangeRates();

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="currency_rates"
                descriptionKey="currency_rates_description"
            />
            <CurrencyList initialRates={exchangeRates} />
        </div>
    );
}
