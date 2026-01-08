import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Modal } from '../../components/molecules/Modal';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Transaction } from '../../lib/supabase';
import { colors, spacing, textStyles } from '../../theme';

interface TransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (transaction: Partial<Transaction>) => Promise<void>;
    transaction?: Transaction | null;
}

const TYPES = [
    { value: 'income', label: 'Receita', icon: '💰', color: colors.success },
    { value: 'expense', label: 'Despesa', icon: '💸', color: colors.error },
] as const;

const CATEGORIES = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
    expense: [
        'Alimentação',
        'Transporte',
        'Moradia',
        'Lazer',
        'Saúde',
        'Educação',
        'Compras',
        'Outros',
    ],
};

export function TransactionModal({
    visible,
    onClose,
    onSave,
    transaction,
}: TransactionModalProps) {
    const [type, setType] = useState<Transaction['type']>(transaction?.type || 'expense');
    const [amount, setAmount] = useState(transaction?.amount.toString() || '');
    const [category, setCategory] = useState(transaction?.category || '');
    const [description, setDescription] = useState(transaction?.description || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const numAmount = parseFloat(amount);

        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Erro', 'Digite um valor válido');
            return;
        }

        if (!category) {
            Alert.alert('Erro', 'Selecione uma categoria');
            return;
        }

        try {
            setLoading(true);
            await onSave({
                type,
                amount: numAmount,
                category,
                description: description.trim() || undefined,
            });
            handleClose();
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAmount('');
        setCategory('');
        setDescription('');
        setType('expense');
        onClose();
    };

    React.useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(transaction.amount.toString());
            setCategory(transaction.category);
            setDescription(transaction.description || '');
        }
    }, [transaction]);

    const availableCategories = CATEGORIES[type];

    return (
        <Modal
            visible={visible}
            onClose={handleClose}
            title={transaction ? 'Editar Transação' : 'Nova Transação'}
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
            <View style={styles.section}>
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.typeRow}>
                    {TYPES.map((t) => (
                        <TouchableOpacity
                            key={t.value}
                            style={[
                                styles.typeOption,
                                type === t.value && { backgroundColor: t.color, borderColor: t.color },
                            ]}
                            onPress={() => {
                                setType(t.value);
                                setCategory(''); // Reset category when changing type
                            }}
                        >
                            <Text style={styles.typeIcon}>{t.icon}</Text>
                            <Text
                                style={[styles.typeText, type === t.value && styles.typeTextSelected]}
                            >
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Input
                label="Valor (R$)"
                placeholder="0,00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                autoFocus={true}
            />

            <View style={styles.section}>
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.categoriesGrid}>
                    {availableCategories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                category === cat && styles.categoryChipSelected,
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    category === cat && styles.categoryTextSelected,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Input
                label="Descrição (opcional)"
                placeholder="Adicione detalhes..."
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={2}
            />
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
    typeRow: {
        flexDirection: 'row',
        gap: spacing[3],
    },
    typeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    typeIcon: {
        fontSize: 20,
    },
    typeText: {
        ...textStyles.body,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    typeTextSelected: {
        color: colors.white,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[2],
    },
    categoryChip: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    categoryChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    categoryText: {
        ...textStyles.caption,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    categoryTextSelected: {
        color: colors.white,
    },
});
