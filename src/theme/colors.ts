/**
 * Sistema de Cores do ZED
 * Paleta premium com efeitos visuais modernos
 */

export const colors = {
  // Cores principais - com variações
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  secondary: '#A1A1AA',
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  
  // Backgrounds - tons mais ricos
  background: '#060B14',
  backgroundSecondary: '#0D1320',
  card: '#131B2E',
  cardHover: '#1A2540',
  cardGlass: 'rgba(19, 27, 46, 0.85)',
  
  // Textos
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  
  // Status - cores vibrantes
  success: '#22C55E',
  successLight: '#4ADE80',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',
  infoLight: '#60A5FA',
  
  // Prioridades (Kanban)
  priorityHigh: '#EF4444',
  priorityMedium: '#F59E0B',
  priorityLow: '#22C55E',
  
  // Categorias (Tarefas) - cores vibrantes
  categoryPersonal: '#A855F7',
  categoryWork: '#3B82F6',
  categoryStudy: '#22C55E',
  categoryHealth: '#EC4899',
  categoryFamily: '#F59E0B',
  
  // UI Elements
  border: '#1E293B',
  borderLight: '#334155',
  borderGlow: 'rgba(59, 130, 246, 0.3)',
  divider: '#1E293B',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  overlayBlur: 'rgba(6, 11, 20, 0.9)',
  
  // Glows e efeitos
  glowPrimary: 'rgba(59, 130, 246, 0.4)',
  glowAccent: 'rgba(245, 158, 11, 0.4)',
  glowSuccess: 'rgba(34, 197, 94, 0.4)',
  glowError: 'rgba(239, 68, 68, 0.4)',
  
  // Transparências
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;

// Gradientes premium
export const gradients = {
  primary: ['#3B82F6', '#1D4ED8'],
  primarySoft: ['#3B82F6', '#2563EB'],
  accent: ['#F59E0B', '#D97706'],
  accentSoft: ['#FBBF24', '#F59E0B'],
  card: ['#1A2540', '#131B2E'],
  cardGlass: ['rgba(26, 37, 64, 0.9)', 'rgba(19, 27, 46, 0.8)'],
  success: ['#22C55E', '#16A34A'],
  danger: ['#EF4444', '#DC2626'],
  purple: ['#A855F7', '#7C3AED'],
  pink: ['#EC4899', '#DB2777'],
  background: ['#0D1320', '#060B14'],
  hero: ['#131B2E', '#060B14'],
  shimmer: ['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent'],
} as const;

// Sombras com glow
export const glowShadows = {
  primary: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  accent: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  success: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;
