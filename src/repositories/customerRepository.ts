import { BaseRepository } from './baseRepository';
import { Customer } from '@/models/customer';

export class CustomerRepository extends BaseRepository<Customer> {
    protected filename = 'customers';

    async getActiveCustomers(): Promise<Customer[]> {
        const customers = await this.getAll();
        return customers.filter((customer) => customer.isActive);
    }

    async findByName(name: string): Promise<Customer[]> {
        const customers = await this.getAll();
        return customers.filter((customer) =>
            customer.name.toLowerCase().includes(name.toLowerCase())
        );
    }
}

export const customerRepository = new CustomerRepository();
