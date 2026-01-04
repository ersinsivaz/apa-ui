import { definitionService } from './definitionService';
import { CashTransactionType, CashTransaction } from '@/models/cash';
import { BankTransactionType, BankTransaction } from '@/models/bank';

export class FinanceService {
    // Cash Operations
    async getAllCashMovements() {
        return await definitionService.getCashMovements();
    }

    async getAllCashTransactions() {
        return await this.getAllCashMovements();
    }

    async createCashTransaction(data: {
        type: CashTransactionType;
        amount: number;
        description: string;
        date: string;
        cashBoxId?: string;
        relatedInvoiceId?: string;
    }) {
        // If no cashBoxId provided, use the first active one as default
        let boxId = data.cashBoxId;
        if (!boxId) {
            const boxes = await definitionService.getCashBoxes();
            const activeBox = boxes.find(b => b.isActive);
            if (!activeBox) throw new Error('Aktif bir kasa bulunamadı.');
            boxId = activeBox.id;
        }

        return await definitionService.createCashMovement({
            cashBoxId: boxId,
            type: data.type,
            amount: data.amount,
            description: data.description,
            date: data.date,
            relatedInvoiceId: data.relatedInvoiceId
        });
    }

    async getCashBalance() {
        const boxes = await definitionService.getCashBoxes();
        return boxes.reduce((acc, box) => acc + box.balance, 0);
    }

    // Bank Operations
    async getAllBankAccounts() {
        return await definitionService.getBankAccounts();
    }

    async createBankTransaction(data: {
        bankAccountId: string;
        type: BankTransactionType;
        amount: number;
        description: string;
        date: string;
        relatedInvoiceId?: string;
    }) {
        const accounts = await definitionService.getBankAccounts();
        const account = accounts.find(a => a.id === data.bankAccountId);
        if (!account) throw new Error('Banka hesabı bulunamadı.');

        // Update balance
        const isIncrease = ['Gelen Havale', 'Para Yatırma'].includes(data.type);
        const delta = isIncrease ? data.amount : -data.amount;

        await definitionService.updateBankAccount(account.id, {
            balance: account.balance + delta
        });

        return { success: true };
    }
}

export const financeService = new FinanceService();
