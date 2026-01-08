import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTransactions } from '../../hooks/useTransactions';
import { Card } from '../../components/molecules/Card';
import { Badge } from '../../components/atoms/Badge';
import { Spinner } from '../../components/atoms/Spinner';
import { FAB } from '../../components/atoms/FAB';
import { TransactionModal } from '../../components/organisms/TransactionModal';
import { Transaction } from '../../lib/supabase';
import { colors, gradients, spacing, textStyles, borderRadius, shadows } from '../../theme';
import { format } from 'date-fns';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    ChevronRight,
} from 'lucide-react-native';

export function FinancesScreen() {
    const {
        transactions,
        loading,
        getMonthSummary,
        createTransaction,
        updateTransaction,
        deleteTransaction,
    } = useTransactions();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

    const summary = getMonthSummary();

    const handleCreateTransaction = async (transactionData: Partial<Transaction>) => {
        await createTransaction(transactionData);
        setModalVisible(false);
    };

    const handleEditTransaction = async (transactionData: Partial<Transaction>) => {
        if (selectedTransaction) {
            await updateTransaction(selectedTransaction.id, transactionData);
            setSelectedTransaction(null);
            setModalVisible(false);
        }
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        Alert.alert(
            'Deletar transação',
            `Tem certeza que deseja deletar esta transação?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTransaction(transaction.id);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível deletar a transação');
                        }
                    },
                },
            ]
        );
    };

    const handleOpenEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    const handleOpenCreate = () => {
        setSelectedTransaction(null);
        setModalVisible(true);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
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
                            <Text style={styles.headerTitle}>Finanças</Text>
                            <Text style={styles.headerSubtitle}>Controle seus gastos</Text>
                        </View>
                        <View style={styles.headerIcon}>
                            <Wallet size={24} color={colors.accent} />
                        </View>
                    </View>
                </Animated.View>

                {/* Balance Card */}
                <Animated.View
                    style={[
                        styles.balanceSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={gradients.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceCard}
                    >
                        <Text style={styles.balanceLabel}>Saldo do Mês</Text>
                        <Text
                            style={[
                                styles.balanceValue,
                                { color: summary.balance >= 0 ? colors.success : colors.error },
                            ]}
                        >
                            {formatCurrency(summary.balance)}
                        </Text>

                        <View style={styles.balanceRow}>
                            <View style={styles.balanceItem}>
                                <View style={[styles.balanceIconContainer, styles.incomeIcon]}>
                                    <ArrowUpCircle size={20} color={colors.success} />
                                </View>
                                <View>
                                    <Text style={styles.balanceItemLabel}>Receitas</Text>
                                    <Text style={[styles.balanceItemValue, { color: colors.success }]}>
                                        {formatCurrency(summary.income)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.balanceDivider} />

                            <View style={styles.balanceItem}>
                                <View style={[styles.balanceIconContainer, styles.expenseIcon]}>
                                    <ArrowDownCircle size={20} color={colors.error} />
                                </View>
                                <View>
                                    <Text style={styles.balanceItemLabel}>Despesas</Text>
                                    <Text style={[styles.balanceItemValue, { color: colors.error }]}>
                                        {formatCurrency(summary.expense)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Transactions */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Transações ({summary.transactions.length})
                        </Text>
                        <TouchableOpacity style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                            <ChevronRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {summary.transactions.length === 0 ? (
                        <Card variant="glass" padding={6}>
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIcon}>
                                    <Wallet size={32} color={colors.textTertiary} />
                                </View>
                                <Text style={styles.emptyText}>Nenhuma transação este mês</Text>
                                <TouchableOpacity style={styles.emptyButton} onPress={handleOpenCreate}>
                                    <Text style={styles.emptyButtonText}>Adicionar transação</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ) : (
                        <View style={styles.transactionsList}>
                            {summary.transactions.map((transaction, index) => (
                                <Card
                                    key={transaction.id}
                                    variant="glass"
                                    padding={4}
                                    onPress={() => handleOpenEdit(transaction)}
                                    style={styles.transactionCard}
                                >
                                    <View style={styles.transactionRow}>
                                        <View style={styles.transactionLeft}>
                                            <View
                                                style={[
                                                    styles.transactionIcon,
                                                    transaction.type === 'income'
                                                        ? styles.incomeIconBg
                                                        : styles.expenseIconBg,
                                                ]}
                                            >
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp size={18} color={colors.success} />
                                                ) : (
                                                    <TrendingDown size={18} color={colors.error} />
                                                )}
                                            </View>
                                            <View style={styles.transactionInfo}>
                                                <Text style={styles.transactionCategory}>
                                                    {transaction.category}
                                                </Text>
                                                {transaction.description && (
                                                    <Text style={styles.transactionDescription} numberOfLines={1}>
                                                        {transaction.description}
                                                    </Text>
                                                )}
                                                <View style={styles.transactionDateRow}>
                                                    <Calendar size={12} color={colors.textTertiary} />
                                                    <Text style={styles.transactionDate}>
                                                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <Text
                                            style={[
                                                styles.transactionAmount,
                                                {
                                                    color:
                                                        transaction.type === 'income'
                                                            ? colors.success
                                                            : colors.error,
                                                },
                                            ]}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </Text>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* FAB */}
            <FAB onPress={handleOpenCreate} variant="accent" />

            <TransactionModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedTransaction(null);
                }}
                onSave={selectedTransaction ? handleEditTransaction : handleCreateTransaction}
                transaction={selectedTransaction}
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
    headerIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Balance Card
    balanceSection: {
        paddingHorizontal: spacing[6],
        marginBottom: spacing[6],
    },
    balanceCard: {
        borderRadius: borderRadius['2xl'],
        padding: spacing[5],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        ...shadows.lg,
    },
    balanceLabel: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing[1],
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -1,
        marginBottom: spacing[4],
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    balanceIconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    incomeIcon: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    balanceDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
        marginHorizontal: spacing[3],
    },
    balanceItemLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    balanceItemValue: {
        ...textStyles.body,
        fontWeight: '700',
    },
    // Section
    section: {
        paddingHorizontal: spacing[6],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing[4],
    },
    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[3],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginBottom: spacing[3],
    },
    emptyButton: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        backgroundColor: colors.accent,
        borderRadius: borderRadius.full,
    },
    emptyButtonText: {
        ...textStyles.bodySmall,
        color: colors.white,
        fontWeight: '600',
    },
    // Transactions
    transactionsList: {
        gap: spacing[3],
    },
    transactionCard: {
        marginBottom: 0,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        flex: 1,
    },
    transactionIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    incomeIconBg: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    expenseIconBg: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionCategory: {
        ...textStyles.body,
        color: colors.text,
        fontWeight: '600',
    },
    transactionDescription: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing[0.5],
    },
    transactionDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        marginTop: spacing[1],
    },
    transactionDate: {
        ...textStyles.caption,
        color: colors.textTertiary,
    },
    transactionAmount: {
        ...textStyles.h4,
        fontWeight: '700',
    },
});
