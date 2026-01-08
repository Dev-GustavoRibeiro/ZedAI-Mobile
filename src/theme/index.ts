/**
 * Theme System
 * Exportação centralizada de todo o sistema de design
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors, gradients, glowShadows } from './colors';
import { fontSizes, lineHeights, textStyles } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const theme = {
    colors,
    gradients,
    glowShadows,
    fontSizes,
    lineHeights,
    textStyles,
    spacing,
    borderRadius,
    shadows,
} as const;

export type Theme = typeof theme;
