/**
 * Sistema de Tipografia do ZED
 * Font families e escalas de tamanho
 */

export const fontFamilies = {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    mono: 'JetBrainsMono-Regular',
} as const;

export const fontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
} as const;

export const lineHeights = {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 56,
} as const;

export const fontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
};

// Text styles pré-definidos
export const textStyles = {
    h1: {
        fontSize: fontSizes['4xl'],
        lineHeight: lineHeights['4xl'],
        fontWeight: fontWeights.bold,
    },
    h2: {
        fontSize: fontSizes['3xl'],
        lineHeight: lineHeights['3xl'],
        fontWeight: fontWeights.bold,
    },
    h3: {
        fontSize: fontSizes['2xl'],
        lineHeight: lineHeights['2xl'],
        fontWeight: fontWeights.semiBold,
    },
    h4: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
        fontWeight: fontWeights.semiBold,
    },
    body: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
        fontWeight: fontWeights.regular,
    },
    bodyLarge: {
        fontSize: fontSizes.lg,
        lineHeight: lineHeights.lg,
        fontWeight: fontWeights.regular,
    },
    bodySmall: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        fontWeight: fontWeights.regular,
    },
    caption: {
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.xs,
        fontWeight: fontWeights.regular,
    },
    button: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
        fontWeight: fontWeights.semiBold,
    },
    code: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        fontFamily: fontFamilies.mono,
    },
} as const;
