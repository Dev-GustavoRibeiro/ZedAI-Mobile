import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, borderRadius } from '../../theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
    name?: string;
    imageUrl?: string;
    size?: AvatarSize;
    style?: ViewStyle;
    gradient?: boolean;
    borderColor?: string;
}

const sizeMap: Record<AvatarSize, number> = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 56,
    xl: 72,
    '2xl': 96,
};

const fontSizeMap: Record<AvatarSize, number> = {
    xs: 11,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    '2xl': 34,
};

const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

// Gera uma cor consistente baseada no nome
const getGradientFromName = (name: string): readonly [string, string] => {
    const gradientOptions: (readonly [string, string])[] = [
        gradients.primary,
        gradients.accent,
        gradients.success,
        gradients.purple,
        gradients.pink,
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % gradientOptions.length;
    return gradientOptions[index];
};

export const Avatar: React.FC<AvatarProps> = ({
    name = 'User',
    imageUrl,
    size = 'md',
    style,
    gradient = true,
    borderColor,
}) => {
    const avatarSize = sizeMap[size];
    const fontSize = fontSizeMap[size];
    const initials = getInitials(name);
    const avatarGradient = getGradientFromName(name);

    const containerStyle: ViewStyle[] = [
        styles.container,
        {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
        },
        borderColor && {
            borderWidth: 2,
            borderColor,
        },
        style,
    ].filter(Boolean) as ViewStyle[];

    if (imageUrl) {
        return (
            <View style={containerStyle}>
                <Image
                    source={{ uri: imageUrl }}
                    style={[
                        styles.image,
                        {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                        },
                    ]}
                />
            </View>
        );
    }

    if (gradient) {
        return (
            <LinearGradient
                colors={avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    containerStyle,
                    styles.gradientContainer,
                ]}
            >
                <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
            </LinearGradient>
        );
    }

    return (
        <View style={[containerStyle, styles.placeholder]}>
            <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    initials: {
        color: colors.white,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
