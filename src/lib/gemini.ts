import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!API_KEY) {
    throw new Error('Missing Gemini API key!');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ActionResult {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Envia uma mensagem para o ZED e recebe uma resposta
 */
export async function sendMessageToZED(
    message: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Construir o contexto da conversa
        const context = `Você é o ZED, um assistente virtual pessoal inteligente e prestativo.
Você ajuda o usuário a organizar sua vida através de tarefas, eventos, finanças e metas.
Seja conciso, amigável e útil.

Histórico da conversa:
${conversationHistory
                .map((msg) => `${msg.role === 'user' ? 'Usuário' : 'ZED'}: ${msg.content}`)
                .join('\n')}

Usuário: ${message}
ZED:`;

        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Erro ao comunicar com Gemini:', error);
        throw new Error('Desculpe, tive um problema ao processar sua mensagem.');
    }
}

/**
 * Detecta se a mensagem do usuário é uma ação (criar tarefa, evento, etc)
 */
export function detectAction(message: string): {
    type: 'task' | 'event' | 'transaction' | 'goal' | null;
    data?: any;
} {
    const lowerMessage = message.toLowerCase();

    // Detectar criação de tarefa
    if (
        lowerMessage.includes('cria') ||
        lowerMessage.includes('adiciona') ||
        lowerMessage.includes('lembre')
    ) {
        if (
            lowerMessage.includes('tarefa') ||
            lowerMessage.includes('lembrete') ||
            lowerMessage.includes('fazer')
        ) {
            return { type: 'task' };
        }
    }

    // Detectar criação de evento
    if (
        lowerMessage.includes('agenda') ||
        lowerMessage.includes('marca') ||
        lowerMessage.includes('reunião')
    ) {
        return { type: 'event' };
    }

    // Detectar registro de gasto
    if (
        lowerMessage.includes('gastei') ||
        lowerMessage.includes('paguei') ||
        lowerMessage.includes('comprei') ||
        lowerMessage.includes('despesa')
    ) {
        return { type: 'transaction', data: { type: 'expense' } };
    }

    // Detectar registro de receita
    if (
        lowerMessage.includes('recebi') ||
        lowerMessage.includes('ganhei') ||
        lowerMessage.includes('receita')
    ) {
        return { type: 'transaction', data: { type: 'income' } };
    }

    // Detectar criação de meta
    if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo')) {
        return { type: 'goal' };
    }

    return { type: null };
}

/**
 * Extrai informações estruturadas de uma mensagem usando IA
 */
export async function extractStructuredData(
    message: string,
    type: 'task' | 'event' | 'transaction' | 'goal'
): Promise<any> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompts: Record<string, string> = {
            task: `Extraia os seguintes dados desta mensagem sobre uma tarefa: "${message}"
Retorne APENAS um JSON válido com:
{
  "title": "título da tarefa",
  "description": "descrição opcional",
  "priority": "low|medium|high",
  "category": "personal|work|study|health|family"
}`,
            event: `Extraia os seguintes dados desta mensagem sobre um evento: "${message}"
Retorne APENAS um JSON válido com:
{
  "title": "título do evento",
  "description": "descrição opcional",
  "type": "meeting|personal|reminder|call",
  "date": "data no formato ISO se mencionada, senão null"
}`,
            transaction: `Extraia os seguintes dados desta mensagem sobre uma transação financeira: "${message}"
Retorne APENAS um JSON válido com:
{
  "amount": valor em número,
  "category": "categoria da transação",
  "description": "descrição"
}`,
            goal: `Extraia os seguintes dados desta mensagem sobre uma meta: "${message}"
Retorne APENAS um JSON válido com:
{
  "title": "título da meta",
  "description": "descrição",
  "category": "health|finance|study|work|personal",
  "timeframe": "short|medium|long"
}`,
        };

        const result = await model.generateContent(prompts[type]);
        const response = await result.response;
        const text = response.text();

        // Extrair JSON da resposta
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return null;
    } catch (error) {
        console.error('Erro ao extrair dados estruturados:', error);
        return null;
    }
}
