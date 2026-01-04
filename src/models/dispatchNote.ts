import { Entity } from './types';

export interface DispatchNoteItem {
    stockId: string;
    stockName: string;
    quantity: number;
}

export interface DispatchNote extends Entity {
    dispatchNo: string;
    customerId: string;
    customerName: string;
    date: string;
    items: DispatchNoteItem[];
    linkedInvoiceId: string | null;
    description?: string;
}
