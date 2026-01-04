import { Entity } from './types';

export type InvoiceStatus = 'Açık' | 'Kısmi Ödendi' | 'Ödendi' | 'İptal';
export type InvoiceType = 'Satış' | 'Alış';

export interface InvoiceItem {
    stockId: string;
    stockName: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    vatTotal: number;
    lineTotal: number;
}

export interface Payment extends Entity {
    invoiceId: string;
    date: string;
    amount: number;
    paymentMethod: 'Kasa' | 'Banka';
    sourceId: string; // Kasa ID veya Banka ID
    sourceName: string;
    description?: string;
}

export interface Installment extends Entity {
    invoiceId: string;
    dueDate: string;
    amount: number;
    status: 'Bekliyor' | 'Ödendi';
    paymentId?: string;
}

export interface Invoice extends Entity {
    invoiceNo: string;
    type: InvoiceType;
    customerId: string;
    customerName: string;
    date: string;
    items: InvoiceItem[];
    subTotal: number;
    vatTotal: number;
    grandTotal: number;
    paidAmount: number;
    status: InvoiceStatus;
    description?: string;
    installments?: Installment[];
}
