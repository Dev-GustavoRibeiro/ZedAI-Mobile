import React, { useState, useRef, useEffect } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    NativeSyntheticEvent,
    TextInputFocusEventData,
    Animated,
    Pressable,
} from 'react-native';
import { colors, spacing, borderRadius, textStyles, shadows } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    variant?: 'default' | 'filled' | 'outline';
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    containerStyle,
    onFocus,
    onBlur,
    variant = 'default',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const borderAnimation = useRef(new Animated.Value(0)).current;
    const labelAnimation = useRef(new Animated.Value(props.value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(borderAnimation, {
            toValue: isFocused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused]);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        Animated.timing(labelAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();
        onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        if (!props.value) {
            Animated.timing(labelAnimation, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
        onBlur?.(e);
    };

    const borderColor = borderAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? colors.error : colors.border, error ? colors.errorLight : colors.primary],
    });

    const glowOpacity = borderAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const getContainerStyle = () => {
        switch (variant) {
            case 'filled':
                return styles.inputContainerFilled;
            case 'outline':
                return styles.inputContainerOutline;
            default:
                return styles.inputContainerDefault;
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[
                    styles.label,
                    isFocused && styles.labelFocused,
                    error && styles.labelError,
                ]}>
                    {label}
                </Text>
            )}

            <Pressable onPress={() => inputRef.current?.focus()}>
                <Animated.View
                    style={[
                        styles.inputWrapper,
                        getContainerStyle(),
                        { borderColor },
                        isFocused && !error && styles.inputWrapperFocused,
                        error && styles.inputWrapperError,
                    ]}
                >
                    {/* Glow effect */}
                    {isFocused && !error && (
                        <Animated.View
                            style={[
                                styles.glowEffect,
                                { opacity: glowOpacity },
                            ]}
                        />
                    )}

                    {leftIcon && (
                        <View style={styles.leftIcon}>
                            {leftIcon}
                        </View>
                    )}

                    <TextInput
                        ref={inputRef}
                        style={[
                            styles.input,
                            leftIcon && styles.inputWithLeftIcon,
                            rightIcon && styles.inputWithRightIcon,
                        ]}
                        placeholderTextColor={colors.textTertiary}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        selectionColor={colors.primary}
                        {...props}
                    />

                    {rightIcon && (
                        <View style={styles.rightIcon}>
                            {rightIcon}
                        </View>
                    )}
                </Animated.View>
            </Pressable>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>{error}</Text>
                </View>
            )}
            {helperText && !error && (
                <Text style={styles.helperText}>{helperText}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing[4],
    },
    label: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing[2],
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    labelFocused: {
        color: colors.primary,
    },
    labelError: {
        color: colors.error,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        position: 'relative',
    },
    inputContainerDefault: {
        backgroundColor: colors.card,
        borderColor: colors.border,
    },
    inputContainerFilled: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: 'transparent',
    },
    inputContainerOutline: {
        backgroundColor: 'transparent',
        borderColor: colors.borderLight,
    },
    inputWrapperFocused: {
        borderColor: colors.primary,
        ...shadows.sm,
    },
    inputWrapperError: {
        borderColor: colors.error,
    },
    glowEffect: {
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.glowPrimary,
    },
    input: {
        flex: 1,
        ...textStyles.body,
        color: colors.text,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        minHeight: 52,
    },
    inputWithLeftIcon: {
        paddingLeft: spacing[2],
    },
    inputWithRightIcon: {
        paddingRight: spacing[2],
    },
    leftIcon: {
        paddingLeft: spacing[4],
    },
    rightIcon: {
        paddingRight: spacing[4],
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing[1],
    },
    error: {
        ...textStyles.caption,
        color: colors.error,
        marginLeft: spacing[1],
    },
    helperText: {
        ...textStyles.caption,
        color: colors.textTertiary,
        marginTop: spacing[1],
    },
});
