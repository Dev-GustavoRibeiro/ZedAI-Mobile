import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, gradients, spacing, borderRadius, textStyles, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
    textStyle?: TextStyle;
    hapticFeedback?: boolean;
}

const variantGradients: Record<string, readonly [string, string]> = {
    primary: gradients.primary,
    danger: gradients.danger,
    success: gradients.success,
    accent: gradients.accent,
};

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    style,
    textStyle,
    hapticFeedback = true,
}) => {
    const handlePress = () => {
        if (disabled || loading) return;

        if (hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        onPress();
    };

    const hasGradient = variant in variantGradients;
    const gradientColors = hasGradient ? variantGradients[variant] : undefined;

    const buttonContent = (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator 
                    color={variant === 'ghost' || variant === 'secondary' ? colors.primary : colors.white} 
                    size={size === 'sm' ? 'small' : 'small'}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
                    <Text
                        style={[
                            styles.text,
                            styles[`text_${variant}`],
                            styles[`text_${size}`],
                            textStyle,
                        ]}
                    >
                        {children}
                    </Text>
                    {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
                </>
            )}
        </View>
    );

    if (hasGradient && gradientColors && !disabled) {
        return (
            <TouchableOpacity
                onPress={handlePress}
                disabled={disabled || loading}
                activeOpacity={0.85}
                style={[
                    fullWidth && styles.fullWidth,
                    disabled && styles.disabled,
                    style,
                ]}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.base,
                        styles.gradientBase,
                        styles[size],
                        variant === 'primary' && styles.primaryGlow,
                        variant === 'success' && styles.successGlow,
                        variant === 'danger' && styles.dangerGlow,
                        variant === 'accent' && styles.accentGlow,
                    ]}
                >
                    {buttonContent}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.base,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style,
            ]}
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {buttonContent}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    gradientBase: {
        borderRadius: borderRadius.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Variants sem gradiente
    primary: {
        backgroundColor: colors.primary,
        ...shadows.md,
    },
    secondary: {
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    danger: {
        backgroundColor: colors.error,
        ...shadows.md,
    },
    success: {
        backgroundColor: colors.success,
        ...shadows.md,
    },
    accent: {
        backgroundColor: colors.accent,
        ...shadows.md,
    },

    // Glow effects
    primaryGlow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    successGlow: {
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    dangerGlow: {
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    accentGlow: {
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },

    // Sizes
    sm: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        minHeight: 36,
    },
    md: {
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[5],
        minHeight: 48,
    },
    lg: {
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[6],
        minHeight: 56,
    },

    // States
    disabled: {
        opacity: 0.4,
    },
    fullWidth: {
        width: '100%',
    },

    // Text styles
    text: {
        ...textStyles.button,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    text_primary: {
        color: colors.white,
        fontWeight: '700',
    },
    text_secondary: {
        color: colors.text,
        fontWeight: '600',
    },
    text_ghost: {
        color: colors.primary,
        fontWeight: '600',
    },
    text_danger: {
        color: colors.white,
        fontWeight: '700',
    },
    text_success: {
        color: colors.white,
        fontWeight: '700',
    },
    text_accent: {
        color: colors.white,
        fontWeight: '700',
    },
    text_sm: {
        fontSize: 13,
    },
    text_md: {
        fontSize: 15,
    },
    text_lg: {
        fontSize: 17,
    },

    // Icons
    iconLeft: {
        marginRight: spacing[2],
    },
    iconRight: {
        marginLeft: spacing[2],
    },
});
