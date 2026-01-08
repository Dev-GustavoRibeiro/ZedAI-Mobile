import { useEffect, useState, useCallback } from 'react';
import { supabase, Task } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useTasks() {
    const { user } = useSupabaseAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar todas as tarefas
    const fetchTasks = useCallback(async () => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Erro ao buscar tarefas:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Criar nova tarefa
    const createTask = async (taskData: Partial<Task>) => {
        if (!user) throw new Error('Usuário não autenticado');

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([
                    {
                        ...taskData,
                        user_id: user.id,
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            setTasks((prev) => [data, ...prev]);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Atualizar tarefa
    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Deletar tarefa
    const deleteTask = async (id: string) => {
        try {
            const { error } = await supabase.from('tasks').delete().eq('id', id);

            if (error) throw error;
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Filtrar tarefas por status
    const getTasksByStatus = (status: Task['status']) => {
        return tasks.filter((task) => task.status === status);
    };

    // Filtrar tarefas por categoria
    const getTasksByCategory = (category: Task['category']) => {
        return tasks.filter((task) => task.category === category);
    };

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        getTasksByStatus,
        getTasksByCategory,
    };
}
