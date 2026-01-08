import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Tipos de dados do Supabase
export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    status: 'todo' | 'doing' | 'done';
    priority: 'low' | 'medium' | 'high';
    category: 'personal' | 'work' | 'study' | 'health' | 'family';
    effort?: number;
    energy?: number;
    due_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string;
    created_at: string;
}

export interface Event {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    type: 'meeting' | 'personal' | 'reminder' | 'call';
    location?: string;
    color?: string;
    created_at: string;
}

export interface Goal {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    category: 'health' | 'finance' | 'study' | 'work' | 'personal';
    timeframe: 'short' | 'medium' | 'long';
    progress: number;
    target_date?: string;
    created_at: string;
    updated_at: string;
}

export interface JournalEntry {
    id: string;
    user_id: string;
    date: string;
    mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
    what_went_well?: string;
    what_to_improve?: string;
    tomorrow_focus?: string;
    created_at: string;
}

export interface Checklist {
    id: string;
    user_id: string;
    title: string;
    items: ChecklistItem[];
    created_at: string;
    updated_at: string;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}
