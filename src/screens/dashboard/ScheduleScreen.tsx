import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEvents } from '../../hooks/useEvents';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { Spinner } from '../../components/atoms/Spinner';
import { colors, spacing, textStyles } from '../../theme';
import { format } from 'date-fns';

export function ScheduleScreen() {
    const { events, loading, getUpcomingEvents } = useEvents();

    if (loading) {
        return <Spinner fullScreen />;
    }

    const upcomingEvents = getUpcomingEvents();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Agenda</Text>
                <Text style={styles.headerSubtitle}>Seus compromissos</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Próximos Eventos ({upcomingEvents.length})
                    </Text>

                    {upcomingEvents.length === 0 ? (
                        <Card padding={4}>
                            <Text style={styles.emptyText}>Nenhum evento próximo</Text>
                        </Card>
                    ) : (
                        upcomingEvents.map((event) => (
                            <Card key={event.id} padding={3} style={styles.eventCard}>
                                <View style={styles.eventHeader}>
                                    <Text style={styles.eventTitle}>{event.title}</Text>
                                    <Badge size="sm" variant="primary">
                                        {event.type}
                                    </Badge>
                                </View>
                                {event.description && (
                                    <Text style={styles.eventDescription}>{event.description}</Text>
                                )}
                                <View style={styles.eventMeta}>
                                    <Text style={styles.eventTime}>
                                        📅 {format(new Date(event.start_time), 'dd/MM/yyyy HH:mm')}
                                    </Text>
                                    {event.location && (
                                        <Text style={styles.eventLocation}>📍 {event.location}</Text>
                                    )}
                                </View>
                            </Card>
                        ))
                    )}
                </View>
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
        gap: spacing[4],
    },
    section: {
        gap: spacing[3],
    },
    sectionTitle: {
        ...textStyles.h4,
        color: colors.text,
    },
    eventCard: {
        marginBottom: spacing[2],
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[2],
    },
    eventTitle: {
        ...textStyles.body,
        color: colors.text,
        fontWeight: '600',
        flex: 1,
    },
    eventDescription: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing[2],
    },
    eventMeta: {
        gap: spacing[1],
    },
    eventTime: {
        ...textStyles.caption,
        color: colors.primary,
    },
    eventLocation: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    emptyText: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: spacing[4],
    },
});
