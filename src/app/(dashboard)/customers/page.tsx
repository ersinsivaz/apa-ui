import { customerService } from '@/services/customerService';
import { CustomerList } from './CustomerList';
import { PageHeader } from '@/components/layout/PageHeader';

export default async function CustomersPage() {
    const customers = await customerService.getAllCustomers();

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="customers"
                descriptionKey="customers_description"
                buttonKey="new_customer"
                buttonHref="/customers/new"
            />
            <CustomerList initialCustomers={customers} />
        </div>
    );
}
