import { dispatchNoteService } from '@/services/dispatchNoteService';
import { PageHeader } from '@/components/layout/PageHeader';
import { DispatchNoteList } from './DispatchNoteList';

export default async function DispatchNotesPage() {
    const notes = await dispatchNoteService.getAllDispatchNotes();

    return (
        <div className="space-y-6">
            <PageHeader
                titleKey="dispatch_notes"
                descriptionKey="dispatch_description"
                buttonKey="new_dispatch"
                buttonHref="/dispatch-notes/new"
            />
            <DispatchNoteList notes={notes} />
        </div>
    );
}
