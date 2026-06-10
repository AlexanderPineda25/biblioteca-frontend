import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useChatbot } from '../../hooks/useChatbot.js';

export default function ChatbotWidget() {
    const { isOpen, open, close, messages, draft, setDraft, loading, error, lastProvider, inputRef, submit: handleSubmit } = useChatbot();

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={open}
                className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-university-700 text-white shadow-lg transition hover:bg-university-800 focus:outline-none focus:ring-4 focus:ring-university-200 dark:bg-university-600 dark:hover:bg-university-500 dark:shadow-slate-900/50"
                aria-label="Abrir chatbot IA"
                title="Abrir chatbot IA"
            >
                <MessageCircle size={24} aria-hidden="true" />
            </button>
        );
    }

    return (
        <section className="fixed inset-x-4 bottom-4 z-40 flex max-h-[78vh] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-6 sm:w-[380px] transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
            <header className="flex items-center justify-between border-b border-slate-200 bg-university-700 px-4 py-3 text-white dark:border-slate-700 dark:bg-university-600">
                <div>
                    <h2 className="text-sm font-semibold">Chatbot IA</h2>
                    <p className="text-xs text-university-100 dark:text-university-300">Gemini, Groq u OpenRouter</p>
                </div>
                <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-university-50 transition hover:bg-university-800 focus:outline-none focus:ring-2 focus:ring-white/70 dark:text-university-200 dark:hover:bg-university-500"
                    aria-label="Cerrar chatbot"
                    title="Cerrar"
                >
                    <X size={18} aria-hidden="true" />
                </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4 dark:bg-slate-800">
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[88%] rounded-md px-3 py-2 text-sm leading-6 ${
                                message.role === 'user'
                                    ? 'bg-university-700 text-white dark:bg-university-600 dark:text-white'
                                    : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                            Pensando...
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                {error && <p className="mb-2 text-xs text-rose-700 dark:text-rose-400">{error}</p>}
                {lastProvider && <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">Ultima respuesta: {lastProvider}</p>}
                <div className="flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={2}
                        maxLength={1000}
                        placeholder="Pregunta sobre libros, disponibilidad o la plataforma..."
                        className="min-h-11 flex-1 resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:bg-white focus:ring-4 focus:ring-university-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:ring-university-900/50"
                    />
                    <button
                        type="submit"
                        disabled={!draft.trim() || loading}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-university-700 text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-university-800 focus:outline-none focus:ring-4 focus:ring-university-100 dark:bg-university-600 dark:hover:bg-university-500 dark:focus:ring-university-900/50"
                        aria-label="Enviar mensaje"
                        title="Enviar"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                    </button>
                </div>
            </form>
        </section>
    );
}
