// Font family constants for the entire application
export const FONTS = {
  PRIMARY: 'FunnelDisplay',
  SECONDARY: 'System', // Fallback font
};

// Flag to use system fonts if custom font fails
export const USE_SYSTEM_FONTS = false; // Set to true if custom font fails

// Font weight constants
export const FONT_WEIGHTS = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
  BLACK: '900',
};

// Font size constants for responsive design
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
  TITLE: 32,
  HERO: 36,
};

// Helper function to get font family with fallback
export const getFontFamily = (weight = 'REGULAR') => {
  if (USE_SYSTEM_FONTS) {
    return {
      fontWeight: FONT_WEIGHTS[weight] || FONT_WEIGHTS.REGULAR,
    };
  }
  return {
    fontFamily: FONTS.PRIMARY,
    fontWeight: FONT_WEIGHTS[weight] || FONT_WEIGHTS.REGULAR,
  };
};

// Fallback function for when custom font is not available
export const getSystemFont = (weight = 'REGULAR') => {
  return {
    fontWeight: FONT_WEIGHTS[weight] || FONT_WEIGHTS.REGULAR,
  };
};

// Helper function to get responsive font size
export const getResponsiveFontSize = (baseSize, screenWidth) => {
  return Math.max(baseSize, Math.min(baseSize * 1.2, screenWidth * 0.05));
}; 