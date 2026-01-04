'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Edit2, Download, Filter, Trash2, AlertTriangle, Info, FilePlus, List } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Customer } from '@/models/customer';
import { deleteCustomerAction, toggleCustomerStatusAction } from '@/app/(dashboard)/customers/actions';
import { Dialog } from '@/components/ui/Dialog';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface CustomerListProps {
    initialCustomers: Customer[];
}

export function CustomerList({ initialCustomers }: CustomerListProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Passive'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState<string | null>(null);

    // Dialog states
    const [confirmDeleteCustomer, setConfirmDeleteCustomer] = useState<Customer | null>(null);
    const [errorDetails, setErrorDetails] = useState<{ title: string, message: string } | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, customer: Customer } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const itemsPerPage = 10;

    const filteredCustomers = initialCustomers.filter(customer => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.taxNumber && customer.taxNumber.includes(searchTerm)) ||
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === 'All' ? true :
                statusFilter === 'Active' ? customer.isActive :
                    !customer.isActive;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val: 'All' | 'Active' | 'Passive') => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const handleContextMenu = (e: React.MouseEvent, customer: Customer) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            customer
        });
    };

    const handleToggleStatus = async (customer: Customer) => {
        setIsToggling(customer.id);
        await toggleCustomerStatusAction(customer.id, customer.isActive);
        setIsToggling(null);
    };

    const handleDelete = async (customer: Customer) => {
        setConfirmDeleteCustomer(customer);
    };

    const confirmDelete = async () => {
        if (!confirmDeleteCustomer) return;

        const customer = confirmDeleteCustomer;
        setConfirmDeleteCustomer(null);
        setIsDeleting(customer.id);

        const result = await deleteCustomerAction(customer.id);

        if (!result.success) {
            setErrorDetails({
                title: t('delete_error'),
                message: result.error || t('no_data')
            });
        }
        setIsDeleting(null);
    };

    const exportToCSV = () => {
        const headers = [t('customer_name'), t('type'), t('tax_number'), t('phone'), t('email'), t('balance'), t('status')];
        const rows = filteredCustomers.map(c => [
            c.name,
            c.type,
            c.taxNumber || '',
            c.phone || '',
            c.email || '',
            c.balance.toString(),
            c.isActive ? t('active') : t('passive')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `musteri_listesi_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('search_customers_placeholder')}
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value as any)}
                    >
                        <option value="All">{t('all_statuses')}</option>
                        <option value="Active">{t('actives')}</option>
                        <option value="Passive">{t('passives')}</option>
                    </select>
                    <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {t('export')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('customer_name')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('type')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('tax_number')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('balance')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{t('status')}</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {t('no_customers_found')}
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors group relative"
                                        onContextMenu={(e) => handleContextMenu(e, customer)}
                                    >
                                        <td className="px-6 py-2.5">
                                            <div className="font-medium text-slate-900 dark:text-white">{customer.name}</div>
                                            <div className="text-[11px] text-slate-500">{customer.email || customer.phone}</div>
                                        </td>
                                        <td className="px-6 py-2.5 text-sm">
                                            <Badge variant="outline" className="text-[10px] px-1.5 h-5">{customer.type}</Badge>
                                        </td>
                                        <td className="px-6 py-2.5 text-xs text-slate-600 dark:text-slate-400">
                                            {customer.taxNumber || '-'}
                                        </td>
                                        <td className="px-6 py-2.5 text-sm">
                                            <span className={cn(
                                                "font-semibold",
                                                customer.balance > 0 ? "text-red-600" : customer.balance < 0 ? "text-emerald-600" : "text-slate-600"
                                            )}>
                                                {formatCurrency(customer.balance)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <button
                                                onClick={() => handleToggleStatus(customer)}
                                                disabled={isToggling === customer.id}
                                                className={cn(
                                                    "transition-opacity hover:opacity-80 disabled:opacity-50",
                                                    isToggling === customer.id && "animate-pulse"
                                                )}
                                                title={customer.isActive ? t('passive') : t('active')}
                                            >
                                                <Badge variant={customer.isActive ? 'success' : 'default'} className="text-[10px] px-1.5 h-5 cursor-pointer">
                                                    {customer.isActive ? t('active') : t('passive')}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-6 py-2.5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/customers/${customer.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" title={t('edit')}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 outline-none"
                                                    onClick={() => handleDelete(customer)}
                                                    disabled={isDeleting === customer.id}
                                                    title={t('delete')}
                                                >
                                                    <Trash2 className={cn("h-4 w-4", isDeleting === customer.id && "animate-pulse")} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-sm text-slate-500">
                            {t('records_info')
                                .replace('{total}', filteredCustomers.length.toString())
                                .replace('{start}', ((currentPage - 1) * itemsPerPage + 1).toString())
                                .replace('{end}', Math.min(currentPage * itemsPerPage, filteredCustomers.length).toString())}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                {t('previous')}
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? 'primary' : 'ghost'}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                {t('next')}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-[100] w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 py-1 animate-in fade-in zoom-in-95 duration-100"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 border-b border-slate-50 dark:border-slate-800 mb-1">
                        {contextMenu.customer.name}
                    </div>
                    <button
                        onClick={() => {
                            router.push(`/invoices/new?customerId=${contextMenu.customer.id}`);
                            setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                    >
                        <FilePlus className="h-4 w-4" />
                        {t('create_invoice')}
                    </button>
                    <button
                        onClick={() => {
                            router.push(`/invoices?customerId=${contextMenu.customer.id}`);
                            setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                    >
                        <List className="h-4 w-4" />
                        {t('my_invoices')}
                    </button>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={!!confirmDeleteCustomer}
                onClose={() => setConfirmDeleteCustomer(null)}
                title={t('delete_customer')}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmDeleteCustomer(null)}>{t('cancel')}</Button>
                        <Button variant="danger" onClick={confirmDelete}>{t('confirm')}</Button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center py-2">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium mb-1">
                        {confirmDeleteCustomer?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                        {t('delete_customer_confirm')}
                    </p>
                </div>
            </Dialog>

            {/* Error/Movement Alert Dialog */}
            <Dialog
                isOpen={!!errorDetails}
                onClose={() => setErrorDetails(null)}
                title={errorDetails?.title || t('edit')}
                footer={
                    <Button variant="primary" onClick={() => setErrorDetails(null)}>OK</Button>
                }
            >
                <div className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3 text-amber-600">
                        <AlertTriangle className="h-6 w-6 shrink-0" />
                        <span className="font-semibold text-sm">Hareket Kısıtlaması</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg w-full">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {errorDetails?.message}
                        </p>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-500 italic">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>Daha fazla bilgi için ilgili müşterinin cari ekstrelerini kontrol edebilirsiniz.</p>
                    </div>
                </div>
            </Dialog>
        </Card>
    );
}
