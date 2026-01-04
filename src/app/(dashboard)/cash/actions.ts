'use server';

import { financeService } from '@/services/financeService';
import { CashTransactionType } from '@/models/cash';
import { BankTransactionType } from '@/models/bank';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCashTransactionAction(formData: FormData) {
    const type = formData.get('type') as CashTransactionType;
    const amount = Number(formData.get('amount'));
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;

    await financeService.createCashTransaction({
        type,
        amount,
        date,
        description,
    });

    revalidatePath('/cash');
    redirect('/cash');
}

export async function createBankAccountAction(formData: FormData) {
    const bankName = formData.get('bankName') as string;
    const accountName = formData.get('accountName') as string;
    const iban = formData.get('iban') as string;

    await financeService.createBankAccount({
        bankName,
        accountName,
        iban,
    });

    revalidatePath('/bank');
    redirect('/bank');
}
