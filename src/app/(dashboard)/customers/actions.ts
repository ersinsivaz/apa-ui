'use server';

import { customerService } from '@/services/customerService';
import { CustomerType } from '@/models/customer';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCustomerAction(formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as CustomerType;
    const taxNumber = formData.get('taxNumber') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    await customerService.createCustomer({
        name,
        type,
        taxNumber: taxNumber || undefined,
        phone: phone || undefined,
        email: email || undefined,
        address: address || undefined,
    });

    revalidatePath('/customers');
    redirect('/customers');
}

export async function updateCustomerAction(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const type = formData.get('type') as CustomerType;
    const taxNumber = formData.get('taxNumber') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    await customerService.updateCustomer(id, {
        name,
        type,
        taxNumber: taxNumber || undefined,
        phone: phone || undefined,
        email: email || undefined,
        address: address || undefined,
    });

    revalidatePath('/customers');
    redirect('/customers');
}

export async function deleteCustomerAction(id: string) {
    try {
        await customerService.deleteCustomer(id);
        revalidatePath('/customers');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function toggleCustomerStatusAction(id: string, currentStatus: boolean) {
    await customerService.updateCustomer(id, { isActive: !currentStatus });
    revalidatePath('/customers');
}
