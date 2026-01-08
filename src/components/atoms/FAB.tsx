import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Plus } from 'lucide-react-native';
import { colors, gradients, borderRadius, shadows } from '../../theme';

type FABVariant = 'primary' | 'accent' | 'success';
type FABSize = 'md' | 'lg';

interface FABProps {
    onPress: () => void;
    icon?: React.ReactNode;
    style?: ViewStyle;
    variant?: FABVariant;
    size?: FABSize;
    label?: string;
}

const variantGradients: Record<FABVariant, readonly [string, string]> = {
    primary: gradients.primary,
    accent: gradients.accent,
    success: gradients.success,
};

const variantGlows: Record<FABVariant, string> = {
    primary: colors.glowPrimary,
    accent: colors.glowAccent,
    success: colors.glowSuccess,
};

export function FAB({ 
    onPress, 
    icon, 
    style, 
    variant = 'primary',
    size = 'lg',
    label,
}: FABProps) {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    const sizeStyles = size === 'lg' ? styles.sizeLg : styles.sizeMd;
    const iconSize = size === 'lg' ? 28 : 24;

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            <LinearGradient
                colors={variantGradients[variant]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.fab,
                    sizeStyles,
                    label ? styles.fabExtended : null,
                    {
                        shadowColor: variantGlows[variant],
                    },
                ]}
            >
                {icon || <Plus size={iconSize} color={colors.white} strokeWidth={2.5} />}
                {label && <Text style={styles.label}>{label}</Text>}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    fab: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },
    sizeMd: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    sizeLg: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    fabExtended: {
        width: 'auto',
        paddingHorizontal: 20,
        borderRadius: borderRadius.full,
    },
    label: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
