import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Modal } from '../../components/molecules/Modal';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Task } from '../../lib/supabase';
import { colors, spacing, textStyles } from '../../theme';

interface TaskModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => Promise<void>;
    task?: Task | null;
}

const PRIORITIES = [
    { value: 'low', label: 'Baixa', color: colors.success },
    { value: 'medium', label: 'Média', color: colors.warning },
    { value: 'high', label: 'Alta', color: colors.error },
] as const;

const CATEGORIES = [
    { value: 'personal', label: 'Pessoal', icon: '👤' },
    { value: 'work', label: 'Trabalho', icon: '💼' },
    { value: 'study', label: 'Estudos', icon: '📚' },
    { value: 'health', label: 'Saúde', icon: '❤️' },
    { value: 'family', label: 'Família', icon: '🏠' },
] as const;

export function TaskModal({ visible, onClose, onSave, task }: TaskModalProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
    const [category, setCategory] = useState<Task['category']>(task?.category || 'personal');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Erro', 'Digite um título para a tarefa');
            return;
        }

        try {
            setLoading(true);
            await onSave({
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                category,
                status: task?.status || 'todo',
            });
            handleClose();
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('personal');
        onClose();
    };

    React.useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setCategory(task.category);
        }
    }, [task]);

    return (
        <Modal
            visible={visible}
            onClose={handleClose}
            title={task ? 'Editar Tarefa' : 'Nova Tarefa'}
            footer={
                <View style={styles.footer}>
                    <Button variant="ghost" onPress={handleClose} style={styles.footerButton}>
                        Cancelar
                    </Button>
                    <Button onPress={handleSave} loading={loading} style={styles.footerButton}>
                        Salvar
                    </Button>
                </View>
            }
        >
            <Input
                label="Título"
                placeholder="Ex: Comprar mantimentos"
                value={title}
                onChangeText={setTitle}
                autoFocus={true}
            />

            <Input
                label="Descrição (opcional)"
                placeholder="Adicione detalhes..."
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
            />

            <View style={styles.section}>
                <Text style={styles.label}>Prioridade</Text>
                <View style={styles.optionsRow}>
                    {PRIORITIES.map((p) => (
                        <TouchableOpacity
                            key={p.value}
                            style={[
                                styles.priorityOption,
                                priority === p.value && { backgroundColor: p.color, borderColor: p.color },
                            ]}
                            onPress={() => setPriority(p.value)}
                        >
                            <Text
                                style={[
                                    styles.priorityText,
                                    priority === p.value && styles.priorityTextSelected,
                                ]}
                            >
                                {p.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.optionsRow}>
                    {CATEGORIES.map((c) => (
                        <TouchableOpacity
                            key={c.value}
                            style={[
                                styles.categoryOption,
                                category === c.value && styles.categoryOptionSelected,
                            ]}
                            onPress={() => setCategory(c.value)}
                        >
                            <Text style={styles.categoryIcon}>{c.icon}</Text>
                            <Text
                                style={[
                                    styles.categoryText,
                                    category === c.value && styles.categoryTextSelected,
                                ]}
                            >
                                {c.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        gap: spacing[3],
    },
    footerButton: {
        flex: 1,
    },
    section: {
        marginBottom: spacing[4],
    },
    label: {
        ...textStyles.bodySmall,
        color: colors.text,
        fontWeight: '600',
        marginBottom: spacing[2],
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[2],
    },
    priorityOption: {
        flex: 1,
        minWidth: '30%',
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        alignItems: 'center',
    },
    priorityText: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    priorityTextSelected: {
        color: colors.white,
    },
    categoryOption: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[3],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        alignItems: 'center',
    },
    categoryOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: spacing[1],
    },
    categoryText: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    categoryTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
});
