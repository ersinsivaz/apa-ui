import { definitionService } from '@/services/definitionService';
import { BankList } from './BankList';
import { PageHeader } from '@/components/layout/PageHeader';

export default async function BankDefinitionsPage() {
    const bankAccounts = await definitionService.getBankAccounts();

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="bank_definitions"
                descriptionKey="bank_definitions_description"
            />
            <BankList initialAccounts={bankAccounts} />
        </div>
    );
}
