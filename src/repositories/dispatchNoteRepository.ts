import { BaseRepository } from './baseRepository';
import { DispatchNote } from '@/models/dispatchNote';

export class DispatchNoteRepository extends BaseRepository<DispatchNote> {
    protected filename = 'dispatch-notes';

    async findByDispatchNo(dispatchNo: string): Promise<DispatchNote | undefined> {
        const notes = await this.getAll();
        return notes.find((note) => note.dispatchNo === dispatchNo);
    }

    async getDispatchNotesByCustomerId(customerId: string): Promise<DispatchNote[]> {
        const notes = await this.getAll();
        return notes.filter((note) => note.customerId === customerId);
    }
}

export const dispatchNoteRepository = new DispatchNoteRepository();
