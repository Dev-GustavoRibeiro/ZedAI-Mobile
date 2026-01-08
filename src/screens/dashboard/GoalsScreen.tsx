import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGoals } from '../../hooks/useGoals';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { Spinner } from '../../components/atoms/Spinner';
import { colors, spacing, textStyles } from '../../theme';

export function GoalsScreen() {
    const { goals, loading, getGoalsByTimeframe } = useGoals();

    if (loading) {
        return <Spinner fullScreen />;
    }

    const shortTermGoals = getGoalsByTimeframe('short');
    const mediumTermGoals = getGoalsByTimeframe('medium');
    const longTermGoals = getGoalsByTimeframe('long');

    const renderGoalsList = (title: string, goals: any[]) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                {title} ({goals.length})
            </Text>

            {goals.length === 0 ? (
                <Card padding={3}>
                    <Text style={styles.emptyText}>Nenhuma meta</Text>
                </Card>
            ) : (
                goals.map((goal) => (
                    <Card key={goal.id} padding={3} style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <Text style={styles.goalTitle}>{goal.title}</Text>
                            <Badge size="sm" variant="secondary">
                                {goal.category}
                            </Badge>
                        </View>
                        {goal.description && (
                            <Text style={styles.goalDescription}>{goal.description}</Text>
                        )}

                        {/* Progress bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${Math.min(goal.progress, 100)}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>{goal.progress}%</Text>
                        </View>
                    </Card>
                ))
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Metas</Text>
                <Text style={styles.headerSubtitle}>Acompanhe seus objetivos</Text>
            </View>

            <View style={styles.content}>
                {renderGoalsList('Curto Prazo', shortTermGoals)}
                {renderGoalsList('Médio Prazo', mediumTermGoals)}
                {renderGoalsList('Longo Prazo', longTermGoals)}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing[6],
        paddingTop: spacing[12],
    },
    headerTitle: {
        ...textStyles.h3,
        color: colors.text,
    },
    headerSubtitle: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
    },
    content: {
        padding: spacing[4],
        gap: spacing[6],
    },
    section: {
        gap: spacing[3],
    },
    sectionTitle: {
        ...textStyles.h4,
        color: colors.text,
    },
    goalCard: {
        marginBottom: spacing[2],
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[2],
    },
    goalTitle: {
        ...textStyles.body,
        color: colors.text,
        fontWeight: '600',
        flex: 1,
    },
    goalDescription: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing[3],
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.card,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    progressText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        fontWeight: '600',
        width: 40,
        textAlign: 'right',
    },
    emptyText: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
