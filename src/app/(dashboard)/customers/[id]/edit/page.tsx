import { customerService } from '@/services/customerService';
import { CustomerForm } from '@/app/(dashboard)/customers/new/CustomerForm';
import { notFound } from 'next/navigation';

export default async function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <CustomerForm initialData={customer} />
        </div>
    );
}
