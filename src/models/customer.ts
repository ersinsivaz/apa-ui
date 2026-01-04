import { Entity } from './types';

export type CustomerType = 'Bireysel' | 'Kurumsal';

export interface Customer extends Entity {
    type: CustomerType;
    name: string;
    taxNumber?: string;
    phone?: string;
    email?: string;
    address?: string;
    balance: number;
    isActive: boolean;
}
