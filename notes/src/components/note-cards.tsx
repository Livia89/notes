import * as Dialog from '@radix-ui/react-dialog';
import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {X} from 'lucide-react';

interface NoteCardProps {
	note: {
		id: string;
		date: Date;
		content: string;
	};
	onNoteDeleted: (id: string) => void;
}

export function NoteCard({note, onNoteDeleted}: NoteCardProps) {
	return (
		<Dialog.Root>
			<Dialog.Trigger className="rounded-md text-left flex flex-col gap-3 overflow-hidden relative outline-none p-5 bg-slate-800  hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 ">
				<span className="text-sm font-medium text-slate-300">
					{formatDistanceToNow(note.date, {/*locale: ptBR*/ addSuffix: true})}
				</span>
				<p className="text-sm leading-6 text-slate-400">{note.content}</p>
				<div className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 fixed bg-black/50" />
				<Dialog.Content className="fixed md:left-1/2 md:top-1/2 md:max-w-[640px] md:h-[60vh] overflow-hidden w-full   md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700 flex flex-col inset-0 md:inset-auto md:rounded-md">
					<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>
					<div className="flex flex-1 flex-col gap-3 p-5">
						<span className="text-sm font-medium text-slate-300">
							{formatDistanceToNow(note.date, {
								/*  locale: ptBR, */
								addSuffix: true,
							})}
						</span>
						<p className="text-sm leading-6 text-slate-400">{note.content}</p>
					</div>
					<button
						type="button"
						onClick={() => onNoteDeleted(note.id)}
						className="w-full font-medium bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none group"
					>
						Would you like to{' '}
						<span className="text-red-400 group-hover:underline">
							delete this note?
						</span>
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
