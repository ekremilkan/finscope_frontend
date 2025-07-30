// Global color palette for the entire application
export const COLORS = {
  // Primary colors
  PRIMARY: '#F7D648',      // Ana sarı renk
  SECONDARY: '#181818',    // Koyu gri/siyah (yeni arka plan)
  
  // Background colors
  BACKGROUND: '#181818',   // Yeni siyah arka plan
  CARD_BACKGROUND: '#1a1a1a', // Kart arka planı (biraz daha açık)
  SURFACE: '#2a2a2a',      // Yüzey rengi
  
  // Text colors
  TEXT_PRIMARY: '#ffffff',   // Ana metin rengi
  TEXT_SECONDARY: '#94a3b8', // İkincil metin rengi
  TEXT_DISABLED: '#64748b',  // Devre dışı metin rengi
  
  // Status colors
  SUCCESS: '#10b981',      // Başarı rengi
  WARNING: '#f59e0b',      // Uyarı rengi
  ERROR: '#ef4444',        // Hata rengi
  INFO: '#3b82f6',         // Bilgi rengi
  
  // Border colors
  BORDER_PRIMARY: 'rgba(247, 214, 72, 0.3)',   // Primary border
  BORDER_SECONDARY: 'rgba(148, 163, 184, 0.2)', // Secondary border
  BORDER_DISABLED: 'rgba(148, 163, 184, 0.1)',  // Disabled border
  
  // Shadow colors
  SHADOW_PRIMARY: '#F7D648',    // Primary shadow
  SHADOW_SECONDARY: '#000000',  // Secondary shadow
  
  // Gradient colors (çok daha yumuşak geçişler)
  GRADIENT_START: 'rgba(247, 214, 72, 0.04)',
  GRADIENT_END: 'rgba(247, 214, 72, 0.01)',
  GRADIENT_CORNER_TOP_RIGHT: 'rgba(247, 214, 72, 0.06)',
  GRADIENT_CORNER_BOTTOM_LEFT: 'rgba(247, 214, 72, 0.03)',
  
  // Glass morphism colors
  GLASS_BACKGROUND: 'rgba(26, 26, 26, 0.8)',
  GLASS_BORDER: 'rgba(148, 163, 184, 0.2)',
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color, opacity) => {
  return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
};

// Helper function to get primary color with opacity
export const getPrimaryWithOpacity = (opacity) => {
  return getColorWithOpacity(COLORS.PRIMARY, opacity);
};

// Helper function to get secondary color with opacity
export const getSecondaryWithOpacity = (opacity) => {
  return getColorWithOpacity(COLORS.SECONDARY, opacity);
};

// Helper function to get gradient colors for corners (çok daha yumuşak)
export const getCornerGradientColors = () => {
  return [
    COLORS.GRADIENT_CORNER_TOP_RIGHT,
    COLORS.GRADIENT_CORNER_BOTTOM_LEFT
  ];
}; 