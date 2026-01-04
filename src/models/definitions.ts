import { Entity } from './types';

export interface CashBox extends Entity {
    name: string;
    code: string;
    currency: string;
    balance: number;
    isActive: boolean;
}

export interface BankAccount extends Entity {
    bankName: string;
    accountName: string;
    accountNumber: string;
    iban: string;
    currency: string;
    balance: number;
    isActive: boolean;
}

export interface ExchangeRate {
    currency: string;
    code: string;
    buying: number;
    selling: number;
    updatedAt: string;
}
