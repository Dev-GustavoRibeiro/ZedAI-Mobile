import { useEffect, useState, useCallback } from 'react';
import { supabase, Goal } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useGoals() {
    const { user } = useSupabaseAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGoals = useCallback(async () => {
        if (!user) {
            setGoals([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGoals(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Erro ao buscar metas:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const createGoal = async (goalData: Partial<Goal>) => {
        if (!user) throw new Error('Usuário não autenticado');

        try {
            const { data, error } = await supabase
                .from('goals')
                .insert([{ ...goalData, user_id: user.id, progress: 0 }])
                .select()
                .single();

            if (error) throw error;
            setGoals((prev) => [data, ...prev]);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateGoal = async (id: string, updates: Partial<Goal>) => {
        try {
            const { data, error } = await supabase
                .from('goals')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setGoals((prev) => prev.map((goal) => (goal.id === id ? data : goal)));
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteGoal = async (id: string) => {
        try {
            const { error } = await supabase.from('goals').delete().eq('id', id);

            if (error) throw error;
            setGoals((prev) => prev.filter((goal) => goal.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const getGoalsByTimeframe = (timeframe: Goal['timeframe']) => {
        return goals.filter((goal) => goal.timeframe === timeframe);
    };

    return {
        goals,
        loading,
        error,
        fetchGoals,
        createGoal,
        updateGoal,
        deleteGoal,
        getGoalsByTimeframe,
    };
}
