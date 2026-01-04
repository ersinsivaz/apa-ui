import { Entity } from './types';

export type BankTransactionType = 'Gelen Havale' | 'Giden Havale' | 'EFT' | 'Para Yatırma' | 'Para Çekme';

export interface BankTransaction extends Entity {
    date: string;
    type: BankTransactionType;
    amount: number;
    description: string;
    relatedInvoiceId?: string;
    bankAccountId: string;
}

export interface BankAccount extends Entity {
    bankName: string;
    accountName: string;
    iban: string;
    balance: number;
}
