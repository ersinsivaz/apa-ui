import { BaseRepository } from './baseRepository';
import { CashTransaction } from '@/models/cash';
import { BankAccount, BankTransaction } from '@/models/bank';

export class CashRepository extends BaseRepository<CashTransaction> {
    protected filename = 'cash-transactions';
}

export class BankAccountRepository extends BaseRepository<BankAccount> {
    protected filename = 'bank-accounts';
}

export class BankTransactionRepository extends BaseRepository<BankTransaction> {
    protected filename = 'bank-transactions';
}

export const cashRepository = new CashRepository();
export const bankAccountRepository = new BankAccountRepository();
export const bankTransactionRepository = new BankTransactionRepository();
