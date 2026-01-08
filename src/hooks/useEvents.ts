import { useEffect, useState, useCallback } from 'react';
import { supabase, Event } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

export function useEvents() {
    const { user } = useSupabaseAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!user) {
            setEvents([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', user.id)
                .order('start_time', { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Erro ao buscar eventos:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const createEvent = async (eventData: Partial<Event>) => {
        if (!user) throw new Error('Usuário não autenticado');

        try {
            const { data, error } = await supabase
                .from('events')
                .insert([{ ...eventData, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            setEvents((prev) => [...prev, data].sort((a, b) =>
                new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            ));
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateEvent = async (id: string, updates: Partial<Event>) => {
        try {
            const { data, error } = await supabase
                .from('events')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setEvents((prev) => prev.map((event) => (event.id === id ? data : event)));
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            const { error } = await supabase.from('events').delete().eq('id', id);

            if (error) throw error;
            setEvents((prev) => prev.filter((event) => event.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const getUpcomingEvents = () => {
        const now = new Date();
        return events.filter((event) => new Date(event.start_time) >= now);
    };

    return {
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        getUpcomingEvents,
    };
}
