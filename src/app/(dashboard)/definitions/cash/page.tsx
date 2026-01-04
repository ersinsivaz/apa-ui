import { definitionService } from '@/services/definitionService';
import { CashList } from './CashList';
import { PageHeader } from '@/components/layout/PageHeader';

export default async function CashDefinitionsPage() {
    const cashBoxes = await definitionService.getCashBoxes();

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="cash_definitions"
                descriptionKey="cash_definitions_description"
            />
            <CashList initialBoxes={cashBoxes} />
        </div>
    );
}
