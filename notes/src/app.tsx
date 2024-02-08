import {ChangeEvent, useState} from 'react';
import {NewNoteCard} from './components/new-note-card';
import {NoteCard} from './components/note-cards';

interface Note {
	id: string;
	date: Date;
	content: string;
}
export function App() {
	const [search, setSearch] = useState<string>('');

	const [notes, setNotes] = useState<Note[]>(() => {
		const notesOnStorage = localStorage.getItem('notes');
		if (notesOnStorage) return JSON.parse(notesOnStorage);
		return [];
	});

	function onNoteCreated(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		};
		const notesArray = [newNote, ...notes];
		setNotes(notesArray);
		localStorage.setItem('notes', JSON.stringify(notesArray));
	}

	function onNoteDeleted(id: string) {
		const notesArray = notes.filter(note => id !== note.id);
		setNotes(notesArray);
		localStorage.setItem('notes', JSON.stringify(notesArray));
	}

	function handleSearch(text: ChangeEvent<HTMLInputElement>) {
		setSearch(text.target.value);
	}

	const filteredNotes =
		search !== ''
			? notes.filter(note =>
					note.content.toLowerCase().includes(search.toLowerCase())
			  )
			: notes;
	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
			<form className="w-full">
				<input
					onChange={handleSearch}
					type="text"
					placeholder="Searching your notes..."
					className=" w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
				/>
			</form>
			<div className="h-px bg-slate-700" />
			<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 auto-rows-[250px]">
				<NewNoteCard onNoteCreated={onNoteCreated} />
				{filteredNotes.map(n => (
					<NoteCard onNoteDeleted={onNoteDeleted} note={n} key={n.id} />
				))}
			</div>
		</div>
	);
}
