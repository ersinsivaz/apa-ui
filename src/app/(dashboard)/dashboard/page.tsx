import { customerService } from '@/services/customerService';
import { stockService } from '@/services/stockService';
import { invoiceService } from '@/services/invoiceService';
import { financeService } from '@/services/financeService';
import { DashboardContent } from './DashboardContent';

export default async function DashboardPage() {
  const [customers, stocks, invoices, cashBalance, bankAccounts] = await Promise.all([
    customerService.getAllCustomers(),
    stockService.getAllStocks(),
    invoiceService.getAllInvoices(),
    financeService.getCashBalance(),
    financeService.getAllBankAccounts(),
  ]);

  // Process chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dailyInvoices = invoices.filter(inv => inv.date === date && inv.type === 'Satış');
    return {
      date: new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      amount: dailyInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
      count: dailyInvoices.length
    };
  });

  // Process monthly profit/loss data
  // Get unique months from last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      label: d.toLocaleDateString('tr-TR', { month: 'long' }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    };
  });

  const monthlyData = months.map(m => {
    const sales = invoices
      .filter(inv => inv.date.startsWith(m.key) && inv.type === 'Satış')
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    const purchases = invoices
      .filter(inv => inv.date.startsWith(m.key) && inv.type === 'Alış')
      .reduce((sum, inv) => sum + inv.grandTotal, 0);

    return {
      month: m.label,
      profit: sales,
      loss: purchases,
      net: sales - purchases
    };
  });

  const bankBalance = bankAccounts.reduce((acc, accnt) => acc + accnt.balance, 0);
  const totalReceivable = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
  const totalPayable = customers.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);

  return (
    <DashboardContent
      customers={customers}
      stocks={stocks}
      invoices={invoices}
      cashBalance={cashBalance}
      bankAccounts={bankAccounts}
      chartData={chartData}
      monthlyData={monthlyData}
      totalReceivable={totalReceivable}
      totalPayable={totalPayable}
      bankBalance={bankBalance}
    />
  );
}
