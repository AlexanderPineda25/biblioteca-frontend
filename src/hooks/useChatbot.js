import { useMemo, useRef, useState } from 'react';
import { sendChatMessage } from '../api/chatbot.api.js';
import { getApiErrorMessage } from '../utils/apiError.js';

const initialMessage = {
  role: 'assistant',
  content: 'Hola. Soy el asistente IA de Biblioteca U. Puedo ayudarte con el catalogo, recomendaciones y dudas sobre la plataforma.',
};

export function useChatbot() {
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

  const open = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  };

  const close = () => {
    setIsOpen(false);
  };

  const submit = async (event) => {
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

  return {
    isOpen, open, close,
    messages, draft, setDraft,
    loading, error, lastProvider,
    inputRef, submit,
  };
}
