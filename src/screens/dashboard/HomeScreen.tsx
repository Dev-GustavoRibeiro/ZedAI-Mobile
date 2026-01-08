import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { Card } from '../../components/molecules/Card';
import { colors, gradients, spacing, textStyles, borderRadius, shadows } from '../../theme';
import {
    ClipboardList,
    Wallet,
    Calendar,
    MessageCircle,
    Target,
    TrendingUp,
    Clock,
    Sparkles,
    ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function HomeScreen() {
    const { user } = useSupabaseAuth();
    const userName = user?.user_metadata?.name || 'Usuário';
    const firstName = userName.split(' ')[0];

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const quickActions = [
        {
            id: '1',
            title: 'Nova Tarefa',
            icon: ClipboardList,
            gradient: gradients.primary,
            glowColor: colors.glowPrimary,
        },
        {
            id: '2',
            title: 'Registrar Gasto',
            icon: Wallet,
            gradient: gradients.accent,
            glowColor: colors.glowAccent,
        },
        {
            id: '3',
            title: 'Novo Evento',
            icon: Calendar,
            gradient: gradients.success,
            glowColor: colors.glowSuccess,
        },
        {
            id: '4',
            title: 'Chat com ZED',
            icon: MessageCircle,
            gradient: gradients.purple,
            glowColor: 'rgba(168, 85, 247, 0.4)',
        },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const renderQuickAction = (action: typeof quickActions[0], index: number) => {
        const Icon = action.icon;
        const delay = index * 100;

        return (
            <Animated.View
                key={action.id}
                style={[
                    styles.quickActionWrapper,
                    {
                        opacity: fadeAnim,
                        transform: [
                            {
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 30],
                                    outputRange: [0, 30 + delay / 10],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.85}>
                    <LinearGradient
                        colors={action.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quickActionGradient}
                    >
                        <View style={[styles.quickActionGlow, { backgroundColor: action.glowColor }]} />
                        <Icon size={28} color={colors.white} strokeWidth={1.5} />
                        <Text style={styles.quickActionText}>{action.title}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={[colors.backgroundSecondary, colors.background]}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
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
                    <View style={styles.greetingContainer}>
                        <View style={styles.greetingRow}>
                            <Text style={styles.greeting}>{getGreeting()},</Text>
                            <Sparkles size={24} color={colors.accent} style={styles.sparkleIcon} />
                        </View>
                        <Text style={styles.userName}>{firstName}!</Text>
                    </View>
                    <Text style={styles.subtitle}>Como posso te ajudar hoje?</Text>
                </Animated.View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                    </View>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map(renderQuickAction)}
                    </View>
                </View>

                {/* Resumo do Dia */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Resumo do Dia</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Ver tudo</Text>
                            <ChevronRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <Card variant="gradient" padding={5}>
                        <View style={styles.summaryGrid}>
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: colors.glowPrimary }]}>
                                    <ClipboardList size={20} color={colors.primary} />
                                </View>
                                <Text style={styles.summaryValue}>5</Text>
                                <Text style={styles.summaryLabel}>Tarefas</Text>
                            </View>

                            <View style={styles.summaryDivider} />

                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: colors.glowSuccess }]}>
                                    <Calendar size={20} color={colors.success} />
                                </View>
                                <Text style={styles.summaryValue}>2</Text>
                                <Text style={styles.summaryLabel}>Eventos</Text>
                            </View>

                            <View style={styles.summaryDivider} />

                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIconContainer, { backgroundColor: colors.glowAccent }]}>
                                    <Wallet size={20} color={colors.accent} />
                                </View>
                                <Text style={styles.summaryValue}>R$ 150</Text>
                                <Text style={styles.summaryLabel}>Gastos</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Metas em Progresso */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Metas em Progresso</Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                            <ChevronRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <Card variant="glass" padding={4}>
                        <View style={styles.goalItem}>
                            <View style={styles.goalHeader}>
                                <View style={[styles.goalIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                                    <Target size={20} color={colors.success} />
                                </View>
                                <View style={styles.goalInfo}>
                                    <Text style={styles.goalTitle}>Economizar R$ 5.000</Text>
                                    <Text style={styles.goalProgress}>65% concluído</Text>
                                </View>
                                <TrendingUp size={20} color={colors.success} />
                            </View>
                            <View style={styles.progressBarContainer}>
                                <LinearGradient
                                    colors={gradients.success}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBar, { width: '65%' }]}
                                />
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Próximos Eventos */}
                <Animated.View
                    style={[
                        styles.section,
                        styles.lastSection,
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
                    </View>

                    <Card variant="glass" padding={4}>
                        <View style={styles.emptyStateContainer}>
                            <View style={styles.emptyStateIcon}>
                                <Clock size={32} color={colors.textTertiary} />
                            </View>
                            <Text style={styles.emptyStateText}>
                                Nenhum evento próximo
                            </Text>
                            <TouchableOpacity style={styles.emptyStateButton}>
                                <Text style={styles.emptyStateButtonText}>Criar evento</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </Animated.View>
            </ScrollView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing[8],
    },
    // Header
    header: {
        padding: spacing[6],
        paddingTop: spacing[12],
    },
    greetingContainer: {
        marginBottom: spacing[2],
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        ...textStyles.h3,
        color: colors.textSecondary,
    },
    sparkleIcon: {
        marginLeft: spacing[2],
    },
    userName: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    // Sections
    section: {
        paddingHorizontal: spacing[6],
        marginBottom: spacing[6],
    },
    lastSection: {
        marginBottom: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
    },
    sectionTitle: {
        ...textStyles.h4,
        color: colors.text,
        fontWeight: '700',
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        ...textStyles.bodySmall,
        color: colors.primary,
        fontWeight: '600',
    },
    // Quick Actions
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[3],
    },
    quickActionWrapper: {
        width: (width - spacing[6] * 2 - spacing[3]) / 2,
    },
    quickActionCard: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.lg,
    },
    quickActionGradient: {
        padding: spacing[4],
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 110,
        position: 'relative',
    },
    quickActionGlow: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        opacity: 0.3,
    },
    quickActionText: {
        ...textStyles.bodySmall,
        color: colors.white,
        fontWeight: '700',
        marginTop: spacing[3],
        textAlign: 'center',
    },
    // Summary
    summaryGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryIconContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[2],
    },
    summaryValue: {
        ...textStyles.h3,
        color: colors.text,
        fontWeight: '800',
    },
    summaryLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    summaryDivider: {
        width: 1,
        height: 60,
        backgroundColor: colors.border,
    },
    // Goals
    goalItem: {
        gap: spacing[3],
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    goalIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        ...textStyles.body,
        color: colors.text,
        fontWeight: '600',
    },
    goalProgress: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing[0.5],
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: borderRadius.full,
    },
    // Empty State
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: spacing[4],
    },
    emptyStateIcon: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[3],
    },
    emptyStateText: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginBottom: spacing[3],
    },
    emptyStateButton: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
    },
    emptyStateButtonText: {
        ...textStyles.bodySmall,
        color: colors.white,
        fontWeight: '600',
    },
});
