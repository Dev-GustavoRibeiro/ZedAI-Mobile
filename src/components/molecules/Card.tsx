import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, borderRadius, shadows } from '../../theme';

type CardVariant = 'default' | 'glass' | 'gradient' | 'elevated' | 'outline';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    padding?: keyof typeof spacing;
    variant?: CardVariant;
    glowColor?: string;
    borderGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    padding = 4,
    variant = 'default',
    glowColor,
    borderGlow = false,
}) => {
    const paddingValue = spacing[padding];

    // Estilos base do card
    const getCardStyle = (): ViewStyle[] => {
        const baseStyle: ViewStyle[] = [styles.card, { padding: paddingValue }];

        switch (variant) {
            case 'glass':
                baseStyle.push(styles.glass);
                break;
            case 'elevated':
                baseStyle.push(styles.elevated);
                break;
            case 'outline':
                baseStyle.push(styles.outline);
                break;
            default:
                baseStyle.push(styles.default);
        }

        if (borderGlow && glowColor) {
            baseStyle.push({
                borderColor: glowColor,
                shadowColor: glowColor,
                shadowOpacity: 0.3,
                shadowRadius: 8,
            });
        }

        return baseStyle;
    };

    // Card com gradiente
    if (variant === 'gradient') {
        const content = (
            <LinearGradient
                colors={gradients.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, styles.gradientCard, { padding: paddingValue }, style]}
            >
                {children}
            </LinearGradient>
        );

        if (onPress) {
            return (
                <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
                    {content}
                </TouchableOpacity>
            );
        }
        return content;
    }

    // Card normal
    const cardStyle = [...getCardStyle(), style];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.85}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};

// Componente auxiliar para header de card
export const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
    children,
    style,
}) => (
    <View style={[styles.cardHeader, style]}>
        {children}
    </View>
);

// Componente auxiliar para footer de card
export const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
    children,
    style,
}) => (
    <View style={[styles.cardFooter, style]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    default: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.card,
    },
    glass: {
        backgroundColor: colors.cardGlass,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        ...shadows.md,
    },
    elevated: {
        backgroundColor: colors.card,
        borderWidth: 0,
        ...shadows.xl,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.borderLight,
    },
    gradientCard: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        ...shadows.lg,
    },
    cardHeader: {
        paddingBottom: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: spacing[3],
    },
    cardFooter: {
        paddingTop: spacing[3],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginTop: spacing[3],
    },
});
