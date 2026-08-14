// ============================================================
// THEME SYSTEM — src/theme/index.ts
// ============================================================
// Centralización de tokens de diseño para el dominio DJ / Sonido y luces.
// Evita valores de color, tipografía y espaciado hardcodeados.
// ============================================================

export const COLORS = {
  // Fondos
  background: '#0d1117',
  surface: '#161b22',
  surfaceAlt: '#21262d',
  surfaceCard: '#1a202c',

  // Colores principales y acentos (Cyberpunk / Event Tech)
  primary: '#38bdf8',       // Azul eléctrico / Cyan
  primaryDim: '#1f293d',
  accent: '#a855f7',        // Morado Neón
  accentDim: '#2e1065',

  // Texto
  textPrimary: '#ffffff',
  textSecondary: '#8b949e',
  textMuted: '#6e7681',
  textInverse: '#0d1117',

  // Estados y Badges
  success: '#4ade80',       // Verde disponible
  successBg: 'rgba(74, 222, 128, 0.15)',
  error: '#f87171',         // Rojo alquilado/agotado
  errorBg: 'rgba(248, 113, 113, 0.15)',
  warning: '#fbbf24',

  // Bordes y Divisores
  border: '#30363d',
  borderHighlight: '#38bdf8',

  // Input y UI
  inputBackground: '#161b22',
  inputBorder: '#30363d',
  inputPlaceholder: '#6e7681',
} as const;

export const TYPOGRAPHY = {
  // Tamaños de fuente
  fontSizeXS: 10,
  fontSizeSM: 12,
  fontSizeMD: 14,
  fontSizeLG: 16,
  fontSizeXL: 20,
  fontSizeXXL: 26,

  // Pesos de fuente
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;
