import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { sendChatMessage } from '../../api/chatbot.api.js';
import { getApiErrorMessage } from '../../utils/apiError.js';

const initialMessage = {
    role: 'assistant',
    content: 'Hola. Soy el asistente IA de Biblioteca U. Puedo ayudarte con el catalogo, recomendaciones y dudas sobre la plataforma.',
};

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([initialMessage]);
    const [draft, setDraft] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastProvider, setLastProvider] = useState('');
    const inputRef = useRef(null);

    const conversationHistory = useMemo(() => (
        messages
            .filter((message) => message !== initialMessage)
            .map(({ role, content }) => ({ role, content }))
            .slice(-8)
    ), [messages]);

    const openChat = () => {
        setIsOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 80);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const text = draft.trim();
        if (!text || loading) return;

        const nextMessages = [...messages, { role: 'user', content: text }];
        setMessages(nextMessages);
        setDraft('');
        setError('');
        setLoading(true);

        try {
            const response = await sendChatMessage({
                message: text,
                conversationId,
                history: conversationHistory,
            });
            const data = response.data;
            setConversationId(data.conversationId);
            setLastProvider(`${data.provider}${data.model ? ` / ${data.model}` : ''}`);
            setMessages((current) => [
                ...current,
                { role: 'assistant', content: data.reply || 'No pude generar una respuesta en este momento.' },
            ]);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, 'No se pudo consultar el chatbot.'));
            setMessages((current) => [
                ...current,
                { role: 'assistant', content: 'Tu mensaje llego al front, pero el servicio de chatbot no respondio. Intenta de nuevo en unos segundos.' },
            ]);
        } finally {
            setLoading(false);
            window.setTimeout(() => inputRef.current?.focus(), 80);
        }
    };

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={openChat}
                className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-university-700 text-white shadow-lg transition hover:bg-university-800 focus:outline-none focus:ring-4 focus:ring-university-200"
                aria-label="Abrir chatbot IA"
                title="Abrir chatbot IA"
            >
                <MessageCircle size={24} aria-hidden="true" />
            </button>
        );
    }

    return (
        <section className="fixed inset-x-4 bottom-4 z-40 flex max-h-[78vh] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-6 sm:w-[380px]">
            <header className="flex items-center justify-between border-b border-slate-200 bg-university-700 px-4 py-3 text-white">
                <div>
                    <h2 className="text-sm font-semibold">Chatbot IA</h2>
                    <p className="text-xs text-university-100">Gemini, Groq u OpenRouter</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-university-50 transition hover:bg-university-800 focus:outline-none focus:ring-2 focus:ring-white/70"
                    aria-label="Cerrar chatbot"
                    title="Cerrar"
                >
                    <X size={18} aria-hidden="true" />
                </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${
                                message.role === 'user'
                                    ? 'bg-university-700 text-white'
                                    : 'border border-slate-200 bg-white text-slate-800'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                            Pensando...
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
                {error && <p className="mb-2 text-xs text-rose-700">{error}</p>}
                {lastProvider && <p className="mb-2 text-xs text-slate-500">Ultima respuesta: {lastProvider}</p>}
                <div className="flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={2}
                        maxLength={1000}
                        placeholder="Pregunta sobre libros, disponibilidad o la plataforma..."
                        className="min-h-11 flex-1 resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-university-500 focus:bg-white focus:ring-4 focus:ring-university-100"
                    />
                    <button
                        type="submit"
                        disabled={!draft.trim() || loading}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-university-700 text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-university-800 focus:outline-none focus:ring-4 focus:ring-university-100"
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
