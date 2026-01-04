'use server';

import { dispatchNoteService } from '@/services/dispatchNoteService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDispatchNoteAction(formData: FormData) {
    const dispatchNo = formData.get('dispatchNo') as string;
    const customerId = formData.get('customerId') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const itemsCount = Number(formData.get('itemsCount'));

    const items = [];
    for (let i = 0; i < itemsCount; i++) {
        const stockId = formData.get(`stockId_${i}`) as string;
        const quantity = Number(formData.get(`quantity_${i}`));

        if (stockId && quantity > 0) {
            items.push({ stockId, quantity });
        }
    }

    if (items.length === 0) {
        throw new Error('En az bir kalem eklemelisiniz.');
    }

    await dispatchNoteService.createDispatchNote({
        dispatchNo,
        customerId,
        date,
        items,
        description,
    });

    revalidatePath('/dispatch-notes');
    revalidatePath('/stock');
    redirect('/dispatch-notes');
}
