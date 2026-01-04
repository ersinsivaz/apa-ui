'use server';

import { definitionService } from '@/services/definitionService';
import { revalidatePath } from 'next/cache';

// Cash Box Actions
export async function createCashBoxAction(data: any) {
    await definitionService.createCashBox(data);
    revalidatePath('/definitions/cash');
}

export async function updateCashBoxAction(id: string, data: any) {
    await definitionService.updateCashBox(id, data);
    revalidatePath('/definitions/cash');
}

export async function deleteCashBoxAction(id: string) {
    await definitionService.deleteCashBox(id);
    revalidatePath('/definitions/cash');
}

export async function toggleCashBoxStatusAction(id: string, currentStatus: boolean) {
    await definitionService.updateCashBox(id, { isActive: !currentStatus });
    revalidatePath('/definitions/cash');
}

// Bank Account Actions
export async function createBankAccountAction(data: any) {
    await definitionService.createBankAccount(data);
    revalidatePath('/definitions/banks');
}

export async function updateBankAccountAction(id: string, data: any) {
    await definitionService.updateBankAccount(id, data);
    revalidatePath('/definitions/banks');
}

export async function deleteBankAccountAction(id: string) {
    await definitionService.deleteBankAccount(id);
    revalidatePath('/definitions/banks');
}

export async function toggleBankAccountStatusAction(id: string, currentStatus: boolean) {
    await definitionService.updateBankAccount(id, { isActive: !currentStatus });
    revalidatePath('/definitions/banks');
}

// Cash Movement Actions
export async function getCashMovementsAction(cashBoxId?: string) {
    return await definitionService.getCashMovements(cashBoxId);
}

export async function createCashMovementAction(data: any) {
    await definitionService.createCashMovement(data);
    revalidatePath('/definitions/cash');
}

export async function deleteCashMovementAction(id: string) {
    await definitionService.deleteCashMovement(id);
    revalidatePath('/definitions/cash');
}

// Exchange Rate Actions
export async function updateExchangeRateAction(code: string, data: any) {
    await definitionService.updateExchangeRate(code, data);
    revalidatePath('/definitions/currencies');
}

export async function deleteExchangeRateAction(code: string) {
    await definitionService.deleteExchangeRate(code);
    revalidatePath('/definitions/currencies');
}
