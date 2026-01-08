import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '../../hooks/useTasks';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { Spinner } from '../../components/atoms/Spinner';
import { FAB } from '../../components/atoms/FAB';
import { TaskModal } from '../../components/organisms/TaskModal';
import { Task } from '../../lib/supabase';
import { colors, gradients, spacing, textStyles, borderRadius, shadows } from '../../theme';
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    Circle,
    Play,
    ChevronRight,
    AlertCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function RoutineScreen() {
    const { tasks, loading, getTasksByStatus, createTask, updateTask, deleteTask } = useTasks();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    if (loading) {
        return <Spinner fullScreen />;
    }

    const todoTasks = getTasksByStatus('todo');
    const doingTasks = getTasksByStatus('doing');
    const doneTasks = getTasksByStatus('done');

    const handleCreateTask = async (taskData: Partial<Task>) => {
        await createTask(taskData);
        setModalVisible(false);
    };

    const handleEditTask = async (taskData: Partial<Task>) => {
        if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
            setSelectedTask(null);
            setModalVisible(false);
        }
    };

    const handleDeleteTask = (task: Task) => {
        Alert.alert('Deletar tarefa', `Tem certeza que deseja deletar "${task.title}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Deletar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTask(task.id);
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível deletar a tarefa');
                    }
                },
            },
        ]);
    };

    const handleMoveTask = async (task: Task, newStatus: Task['status']) => {
        try {
            await updateTask(task.id, { status: newStatus });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível mover a tarefa');
        }
    };

    const handleOpenEdit = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleOpenCreate = () => {
        setSelectedTask(null);
        setModalVisible(true);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return colors.error;
            case 'medium': return colors.warning;
            default: return colors.success;
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertCircle size={14} color={colors.error} />;
            case 'medium': return <Clock size={14} color={colors.warning} />;
            default: return <Circle size={14} color={colors.success} />;
        }
    };

    const renderTask = (task: Task) => (
        <Card key={task.id} variant="glass" padding={4} onPress={() => handleOpenEdit(task)}>
            <View style={styles.taskContent}>
                {/* Header */}
                <View style={styles.taskHeader}>
                    <View style={styles.taskTitleRow}>
                        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                        <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                    </View>
                </View>

                {task.description && (
                    <Text style={styles.taskDescription} numberOfLines={2}>
                        {task.description}
                    </Text>
                )}

                {/* Meta */}
                <View style={styles.taskMeta}>
                    <Badge size="sm" variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                    <Badge size="sm" variant="secondary">
                        {task.category}
                    </Badge>
                </View>

                {/* Actions */}
                <View style={styles.taskActions}>
                    {task.status !== 'todo' && (
                        <TouchableOpacity
                            onPress={() => handleMoveTask(task, 'todo')}
                            style={styles.actionButton}
                        >
                            <Circle size={16} color={colors.textTertiary} />
                            <Text style={styles.actionText}>A Fazer</Text>
                        </TouchableOpacity>
                    )}
                    {task.status !== 'doing' && (
                        <TouchableOpacity
                            onPress={() => handleMoveTask(task, 'doing')}
                            style={styles.actionButton}
                        >
                            <Play size={16} color={colors.primary} fill={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.primary }]}>Iniciar</Text>
                        </TouchableOpacity>
                    )}
                    {task.status !== 'done' && (
                        <TouchableOpacity
                            onPress={() => handleMoveTask(task, 'done')}
                            style={styles.actionButton}
                        >
                            <CheckCircle2 size={16} color={colors.success} />
                            <Text style={[styles.actionText, { color: colors.success }]}>Concluir</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Card>
    );

    const renderColumn = (
        title: string,
        tasks: Task[],
        icon: React.ReactNode,
        gradient: readonly [string, string],
        status: string
    ) => (
        <Animated.View
            style={[
                styles.column,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.columnHeader}>
                <LinearGradient
                    colors={gradient}
                    style={styles.columnIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {icon}
                </LinearGradient>
                <Text style={styles.columnTitle}>{title}</Text>
                <View style={styles.columnBadge}>
                    <Text style={styles.columnBadgeText}>{tasks.length}</Text>
                </View>
            </View>

            {tasks.length === 0 ? (
                <View style={styles.emptyColumn}>
                    <Text style={styles.emptyText}>Nenhuma tarefa</Text>
                </View>
            ) : (
                <View style={styles.tasksList}>
                    {tasks.map(renderTask)}
                </View>
            )}
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={[colors.backgroundSecondary, colors.background]}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerTitle}>Minhas Tarefas</Text>
                            <Text style={styles.headerSubtitle}>Organize seu dia com Kanban</Text>
                        </View>
                        <View style={styles.headerStats}>
                            <Text style={styles.statsNumber}>{tasks.length}</Text>
                            <Text style={styles.statsLabel}>Total</Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <LinearGradient
                                colors={gradients.success}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                    styles.progressFill,
                                    {
                                        width: tasks.length > 0
                                            ? `${(doneTasks.length / tasks.length) * 100}%`
                                            : '0%',
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {doneTasks.length} de {tasks.length} concluídas
                        </Text>
                    </View>
                </Animated.View>

                {/* Kanban Columns */}
                <View style={styles.kanbanContainer}>
                    {renderColumn(
                        'A Fazer',
                        todoTasks,
                        <Circle size={18} color={colors.white} />,
                        [colors.textTertiary, colors.textSecondary],
                        'todo'
                    )}
                    {renderColumn(
                        'Fazendo',
                        doingTasks,
                        <Play size={18} color={colors.white} fill={colors.white} />,
                        gradients.primary,
                        'doing'
                    )}
                    {renderColumn(
                        'Concluído',
                        doneTasks,
                        <CheckCircle2 size={18} color={colors.white} />,
                        gradients.success,
                        'done'
                    )}
                </View>
            </ScrollView>

            {/* FAB */}
            <FAB onPress={handleOpenCreate} />

            <TaskModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedTask(null);
                }}
                onSave={selectedTask ? handleEditTask : handleCreateTask}
                task={selectedTask}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
    },
    scrollContent: {
        paddingBottom: spacing[20],
    },
    // Header
    header: {
        padding: spacing[6],
        paddingTop: spacing[12],
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[4],
    },
    headerTitle: {
        ...textStyles.h2,
        color: colors.text,
        fontWeight: '800',
    },
    headerSubtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    headerStats: {
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statsNumber: {
        ...textStyles.h3,
        color: colors.primary,
        fontWeight: '800',
    },
    statsLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    // Progress
    progressContainer: {
        gap: spacing[2],
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: borderRadius.full,
    },
    progressText: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    // Kanban
    kanbanContainer: {
        padding: spacing[4],
        gap: spacing[6],
    },
    column: {
        gap: spacing[3],
    },
    columnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        paddingHorizontal: spacing[2],
    },
    columnIcon: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnTitle: {
        ...textStyles.h4,
        color: colors.text,
        fontWeight: '700',
        flex: 1,
    },
    columnBadge: {
        backgroundColor: colors.card,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    columnBadgeText: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    // Empty
    emptyColumn: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    emptyText: {
        ...textStyles.body,
        color: colors.textTertiary,
        textAlign: 'center',
    },
    // Tasks
    tasksList: {
        gap: spacing[3],
    },
    taskContent: {
        gap: spacing[3],
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    taskTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing[2],
        flex: 1,
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: spacing[1.5],
    },
    taskTitle: {
        ...textStyles.body,
        color: colors.text,
        fontWeight: '600',
        flex: 1,
    },
    taskDescription: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    taskMeta: {
        flexDirection: 'row',
        gap: spacing[2],
        flexWrap: 'wrap',
    },
    taskActions: {
        flexDirection: 'row',
        gap: spacing[3],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing[3],
        marginTop: spacing[1],
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        paddingVertical: spacing[1],
    },
    actionText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        fontWeight: '600',
    },
});
