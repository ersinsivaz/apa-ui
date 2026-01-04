import { financeService } from '@/services/financeService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Landmark, CreditCard, Plus, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

export default async function BankPage() {
    const accounts = await financeService.getAllBankAccounts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Banka Hesapları</h1>
                    <p className="text-slate-500 dark:text-slate-400">Bankadaki varlıklarınızı ve transferlerinizi yönetin.</p>
                </div>
                <Link href="/bank/new-account">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Yeni Hesap Tanımla
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length === 0 ? (
                    <Card className="col-span-full py-12 text-center text-slate-500">
                        Henüz banka hesabı tanımlanmamış.
                    </Card>
                ) : (
                    accounts.map((account) => (
                        <Card key={account.id} className="hover:shadow-md transition-shadow group">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                        <Landmark className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <Badge variant="outline">Aktif</Badge>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{account.bankName}</h4>
                                    <p className="text-sm text-slate-500">{account.accountName}</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-400 uppercase font-semibold">Bakiye</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                        {formatCurrency(account.balance)}
                                    </p>
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <Link href={`/bank/new-transaction?accountId=${account.id}`} className="flex-1">
                                        <Button variant="secondary" className="w-full text-xs h-8">İşlem Yap</Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" className="h-8">Detay</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
