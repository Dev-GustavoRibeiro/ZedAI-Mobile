import { useState, useCallback } from 'react';
import {
    ChatMessage,
    sendMessageToZED,
    detectAction,
    extractStructuredData,
} from '../lib/gemini';
import { storage, STORAGE_KEYS } from '../lib/storage';

const MAX_HISTORY = 20; // Limitar histórico para performance

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carregar histórico do storage
    const loadHistory = useCallback(async () => {
        try {
            const history = await storage.getItem<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY);
            if (history) {
                setMessages(history);
            }
        } catch (err) {
            console.error('Erro ao carregar histórico:', err);
        }
    }, []);

    // Salvar histórico no storage
    const saveHistory = useCallback(async (msgs: ChatMessage[]) => {
        try {
            // Manter apenas os últimos N mensagens
            const recentMessages = msgs.slice(-MAX_HISTORY);
            await storage.setItem(STORAGE_KEYS.CHAT_HISTORY, recentMessages);
        } catch (err) {
            console.error('Erro ao salvar histórico:', err);
        }
    }, []);

    // Enviar mensagem
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim()) return;

            const userMessage: ChatMessage = {
                role: 'user',
                content: text,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setLoading(true);
            setError(null);

            try {
                // Detectar se é uma ação
                const action = detectAction(text);

                // Enviar para Gemini
                const response = await sendMessageToZED(text, messages);

                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: response,
                    timestamp: new Date(),
                };

                const updatedMessages = [...messages, userMessage, assistantMessage];
                setMessages(updatedMessages);
                await saveHistory(updatedMessages);

                // Retornar ação detectada para o componente processar
                return { response, action };
            } catch (err: any) {
                const errorMsg =
                    err.message || 'Desculpe, tive um problema ao processar sua mensagem.';
                setError(errorMsg);

                const errorMessage: ChatMessage = {
                    role: 'assistant',
                    content: errorMsg,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, errorMessage]);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [messages, saveHistory]
    );

    // Extrair dados estruturados de uma mensagem
    const extractData = useCallback(
        async (
            message: string,
            type: 'task' | 'event' | 'transaction' | 'goal'
        ) => {
            try {
                const data = await extractStructuredData(message, type);
                return data;
            } catch (err) {
                console.error('Erro ao extrair dados:', err);
                return null;
            }
        },
        []
    );

    // Limpar histórico
    const clearHistory = useCallback(async () => {
        setMessages([]);
        await storage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    }, []);

    return {
        messages,
        loading,
        error,
        sendMessage,
        extractData,
        clearHistory,
        loadHistory,
    };
}
