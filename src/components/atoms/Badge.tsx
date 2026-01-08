import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, borderRadius } from '../../theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'purple';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    style?: ViewStyle;
    textStyle?: TextStyle;
    gradient?: boolean;
    dot?: boolean;
}

const variantGradients: Record<string, readonly [string, string]> = {
    primary: gradients.primary,
    success: gradients.success,
    warning: gradients.accent,
    error: gradients.danger,
    purple: gradients.purple,
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    style,
    textStyle,
    gradient = false,
    dot = false,
}) => {
    const hasGradient = gradient && variant in variantGradients;

    // Badge com ponto indicador
    if (dot) {
        return (
            <View style={[styles.dotContainer, style]}>
                <View style={[styles.dot, styles[`dot_${variant}`]]} />
                <Text style={[styles.dotText, styles[`dotText_${size}`], textStyle]}>
                    {children}
                </Text>
            </View>
        );
    }

    // Badge com gradiente
    if (hasGradient) {
        const gradientColors = variantGradients[variant];
        return (
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.base, styles[size], styles.gradientBase, style]}
            >
                <Text style={[styles.text, styles[`text_${size}`], textStyle]}>
                    {children}
                </Text>
            </LinearGradient>
        );
    }

    // Badge normal
    return (
        <View style={[styles.base, styles[variant], styles[size], style]}>
            <Text style={[styles.text, styles[`text_${size}`], styles[`textColor_${variant}`], textStyle]}>
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    gradientBase: {
        overflow: 'hidden',
    },

    // Variants - cores sólidas com transparência
    primary: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    secondary: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    success: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    warning: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    info: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    purple: {
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.3)',
    },

    // Sizes
    sm: {
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[0.5],
    },
    md: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
    },
    lg: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[1.5],
    },

    // Text
    text: {
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    text_sm: {
        fontSize: 10,
    },
    text_md: {
        fontSize: 12,
    },
    text_lg: {
        fontSize: 14,
    },

    // Text colors por variant
    textColor_primary: {
        color: colors.primary,
    },
    textColor_secondary: {
        color: colors.textSecondary,
    },
    textColor_success: {
        color: colors.success,
    },
    textColor_warning: {
        color: colors.warning,
    },
    textColor_error: {
        color: colors.error,
    },
    textColor_info: {
        color: colors.info,
    },
    textColor_purple: {
        color: colors.categoryPersonal,
    },

    // Dot badge
    dotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1.5],
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dot_primary: {
        backgroundColor: colors.primary,
    },
    dot_secondary: {
        backgroundColor: colors.textSecondary,
    },
    dot_success: {
        backgroundColor: colors.success,
    },
    dot_warning: {
        backgroundColor: colors.warning,
    },
    dot_error: {
        backgroundColor: colors.error,
    },
    dot_info: {
        backgroundColor: colors.info,
    },
    dot_purple: {
        backgroundColor: colors.categoryPersonal,
    },
    dotText: {
        color: colors.text,
        fontWeight: '500',
    },
    dotText_sm: {
        fontSize: 12,
    },
    dotText_md: {
        fontSize: 14,
    },
    dotText_lg: {
        fontSize: 16,
    },
});
