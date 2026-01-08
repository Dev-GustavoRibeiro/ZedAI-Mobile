import { useEffect, useState, useCallback } from 'react';
import { supabase, Transaction } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useTransactions() {
    const { user } = useSupabaseAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar todas as transações
    const fetchTransactions = useCallback(async () => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Erro ao buscar transações:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Criar nova transação
    const createTransaction = async (transactionData: Partial<Transaction>) => {
        if (!user) throw new Error('Usuário não autenticado');

        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert([
                    {
                        ...transactionData,
                        user_id: user.id,
                        date: transactionData.date || new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            setTransactions((prev) => [data, ...prev]);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Atualizar transação
    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setTransactions((prev) =>
                prev.map((transaction) => (transaction.id === id ? data : transaction))
            );
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Deletar transação
    const deleteTransaction = async (id: string) => {
        try {
            const { error } = await supabase.from('transactions').delete().eq('id', id);

            if (error) throw error;
            setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Calcular resumo do mês atual
    const getMonthSummary = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthTransactions = transactions.filter((t) => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const income = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expense,
            balance: income - expense,
            transactions: monthTransactions,
        };
    };

    //Filtrar por tipo
    const getTransactionsByType = (type: Transaction['type']) => {
        return transactions.filter((t) => t.type === type);
    };

    // Agrupar por categoria
    const getByCategory = () => {
        const grouped: Record<string, { total: number; count: number }> = {};

        transactions.forEach((t) => {
            if (!grouped[t.category]) {
                grouped[t.category] = { total: 0, count: 0 };
            }
            grouped[t.category].total += t.amount;
            grouped[t.category].count += 1;
        });

        return grouped;
    };

    return {
        transactions,
        loading,
        error,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getMonthSummary,
        getTransactionsByType,
        getByCategory,
    };
}
