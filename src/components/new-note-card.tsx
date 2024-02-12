import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

let speechRecognition: SpeechRecognition | null = null;

interface NewNoteCardProps {
	onNoteCreated: (content: string) => void;
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
	const [shouldShowOnboarding, setShouldShowOnboarding] =
		useState<Boolean>(true);
	const [content, setContent] = useState<string>('');
	const [isRecording, setIsRecording] = useState(false);
	function handleStartEditor() {
		setShouldShowOnboarding(false);
	}

	function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);
		event.target.value === '' && setShouldShowOnboarding(true);
	}

	function handleSaveNote(event: FormEvent) {
		event.preventDefault();
		if (content === '') return;
		onNoteCreated(content);
		setContent('');
		setShouldShowOnboarding(true);
		toast.success('Note created successfully');
	}

	function handleStartRecording() {
		const isSpeechRecognitionAPIAvailable =
			'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

		if (!isSpeechRecognitionAPIAvailable) {
			alert('Not available API on browser');
			return;
		}

		setIsRecording(true);
		setShouldShowOnboarding(false);

		const SpeechRecognitionAPI =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		speechRecognition = new SpeechRecognitionAPI();

		speechRecognition.continuous = true; // não para de gravar enquanto não por stop
		speechRecognition.maxAlternatives = 1; // devolve uma tentativa caso não entenda a palavra
		speechRecognition.interimResults = true; // vai trazendo os resultados em runtime

		speechRecognition.onresult = event => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript);
			}, ''); // o text é a '' no inicio do loop. O result é o valor iterado que concatena em text
			setContent(transcription);
		};
		speechRecognition.onerror = event => {
			console.error(event);
		};

		speechRecognition.start();
	}

	function handleStopRecording() {
		setIsRecording(false);
	}
	return (
		<Dialog.Root>
			<Dialog.Trigger className="rounded-md overflow-hidden relative p-5 bg-slate-700 flex flex-col gap-3 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 ">
				<span className="text-sm font-medium text-slate-200">Add Note</span>
				<p className="text-sm leading-6 text-slate-400">Save an audio note</p>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 fixed bg-black/50" />
				<Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:max-w-[640px] md:h-[60vh] overflow-hidden w-full  md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700 flex flex-col md:rounded-md">
					<Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
						<X
							className="size-5"
							onClick={() => {
								setShouldShowOnboarding(true);
								setIsRecording(false);
							}}
						/>
					</Dialog.Close>
					<form className="flex-col flex-1 flex">
						<div className="flex flex-1 flex-col gap-3 p-5 ">
							<span className="text-sm font-medium text-slate-300">
								Add note
							</span>
							{shouldShowOnboarding ? (
								<p className="text-sm leading-6 text-slate-400">
									Save an{' '}
									<button
										type="button"
										className="text-lime-400 font-mediun hover:underline"
										onClick={handleStartRecording}
									>
										audio note
									</button>{' '}
									or, if you prefer, just{' '}
									<button
										className="text-lime-400 font-mediun hover:underline"
										onClick={handleStartEditor}
									>
										use text
									</button>
								</p>
							) : (
								<textarea
									onChange={handleContentChanged}
									autoFocus
									className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
									value={content}
								/>
							)}
						</div>
						{isRecording ? (
							<button
								type="button"
								onClick={handleStopRecording}
								className="w-full font-medium bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none flex justify-center items-center gap-2 hover:text-slate-100"
							>
								<div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
								Recording... (Press to stop)
							</button>
						) : (
							<button
								type="button"
								onClick={handleSaveNote}
								className="w-full font-medium bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none hover:bg-lime-500"
							>
								Save note
							</button>
						)}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
