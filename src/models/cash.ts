import { Entity } from './types';

export type CashTransactionType = 'Giriş' | 'Çıkış';

export interface CashTransaction extends Entity {
    cashBoxId?: string;
    date: string;
    type: CashTransactionType;
    amount: number;
    description: string;
    relatedInvoiceId?: string;
}
