import { financeService } from '@/services/financeService';
import { CashHeader } from './CashHeader';
import { CashContent } from './CashContent';

export default async function CashPage() {
    const transactions = await financeService.getAllCashTransactions();
    const balance = await financeService.getCashBalance();

    return (
        <div className="space-y-6">
            <CashHeader />
            <CashContent transactions={transactions} balance={balance} />
        </div>
    );
}
