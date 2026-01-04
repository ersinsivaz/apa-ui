import { readJson, writeJson } from '@/lib/db';
import { CashBox, BankAccount, ExchangeRate } from '@/models/definitions';
import { CashTransaction } from '@/models/cash';
import { v4 as uuidv4 } from 'uuid';

class DefinitionService {
    // Cash Boxes
    async getCashBoxes(): Promise<CashBox[]> {
        return readJson<CashBox>('cash-boxes');
    }

    async createCashBox(data: Omit<CashBox, 'id' | 'createdAt' | 'updatedAt'>): Promise<CashBox> {
        const boxes = await this.getCashBoxes();
        const newBox: CashBox = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        boxes.push(newBox);
        await writeJson('cash-boxes', boxes);
        return newBox;
    }

    async updateCashBox(id: string, data: Partial<CashBox>): Promise<CashBox> {
        const boxes = await this.getCashBoxes();
        const index = boxes.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Kasa bulunamadı');

        const updated = {
            ...boxes[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        boxes[index] = updated;
        await writeJson('cash-boxes', boxes);
        return updated;
    }

    async deleteCashBox(id: string): Promise<void> {
        const boxes = await this.getCashBoxes();
        const filtered = boxes.filter(b => b.id !== id);
        await writeJson('cash-boxes', filtered);
    }

    // Cash Movements
    async getCashMovements(cashBoxId?: string): Promise<CashTransaction[]> {
        const allMovements = await readJson<CashTransaction>('cash-movements');
        if (cashBoxId) {
            return allMovements.filter(m => m.cashBoxId === cashBoxId);
        }
        return allMovements;
    }

    async createCashMovement(data: Omit<CashTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<CashTransaction> {
        const movements = await this.getCashMovements();
        const newMovement: CashTransaction = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        movements.push(newMovement);
        await writeJson('cash-movements', movements);

        // Update box balance
        const boxes = await this.getCashBoxes();
        const boxIndex = boxes.findIndex(b => b.id === data.cashBoxId);
        if (boxIndex !== -1) {
            const delta = data.type === 'Giriş' ? data.amount : -data.amount;
            boxes[boxIndex].balance += delta;
            boxes[boxIndex].updatedAt = new Date().toISOString();
            await writeJson('cash-boxes', boxes);
        }

        return newMovement;
    }

    async deleteCashMovement(id: string): Promise<void> {
        const movements = await this.getCashMovements();
        const txToDelete = movements.find(m => m.id === id);
        if (!txToDelete) return;

        const filtered = movements.filter(m => m.id !== id);
        await writeJson('cash-movements', filtered);

        // Revert box balance
        const boxes = await this.getCashBoxes();
        const boxIndex = boxes.findIndex(b => b.id === txToDelete.cashBoxId);
        if (boxIndex !== -1) {
            const delta = txToDelete.type === 'Giriş' ? -txToDelete.amount : txToDelete.amount;
            boxes[boxIndex].balance += delta;
            boxes[boxIndex].updatedAt = new Date().toISOString();
            await writeJson('cash-boxes', boxes);
        }
    }

    // Bank Accounts
    async getBankAccounts(): Promise<BankAccount[]> {
        return readJson<BankAccount>('bank-accounts');
    }

    async createBankAccount(data: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankAccount> {
        const accounts = await this.getBankAccounts();
        const newAccount: BankAccount = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        accounts.push(newAccount);
        await writeJson('bank-accounts', accounts);
        return newAccount;
    }

    async updateBankAccount(id: string, data: Partial<BankAccount>): Promise<BankAccount> {
        const accounts = await this.getBankAccounts();
        const index = accounts.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Banka hesabı bulunamadı');

        const updated = {
            ...accounts[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        accounts[index] = updated;
        await writeJson('bank-accounts', accounts);
        return updated;
    }

    async deleteBankAccount(id: string): Promise<void> {
        const accounts = await this.getBankAccounts();
        const filtered = accounts.filter(a => a.id !== id);
        await writeJson('bank-accounts', filtered);
    }

    // Exchange Rates
    async getExchangeRates(): Promise<ExchangeRate[]> {
        const rates = await readJson<ExchangeRate>('exchange-rates');
        // If file doesn't exist or is empty, we return empty list but readJson already does that correctly.
        return rates;
    }

    async updateExchangeRate(code: string, data: Partial<ExchangeRate>): Promise<ExchangeRate> {
        const rates = await this.getExchangeRates();
        const index = rates.findIndex(r => r.code === code);

        if (index === -1) {
            // Create if doesn't exist (for new currencies)
            const newRate: ExchangeRate = {
                code,
                currency: data.currency || code,
                buying: data.buying || 0,
                selling: data.selling || 0,
                updatedAt: new Date().toISOString(),
            };
            rates.push(newRate);
            await writeJson('exchange-rates', rates);
            return newRate;
        }

        const updated = {
            ...rates[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        rates[index] = updated;
        await writeJson('exchange-rates', rates);
        return updated;
    }

    async deleteExchangeRate(code: string): Promise<void> {
        const rates = await this.getExchangeRates();
        const filtered = rates.filter(r => r.code !== code);
        await writeJson('exchange-rates', filtered);
    }
}

export const definitionService = new DefinitionService();
