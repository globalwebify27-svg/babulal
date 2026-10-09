/**
 * ═══ HAPTIC FEEDBACK ENGINE ═══
 * Provides subtle tactile feedback for mobile devices (supported on Android/Chrome).
 */

export const Haptics = {
  /**
   * Subtle tap for navigation and light interactions
   */
  light: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  /**
   * Standard feedback for button clicks
   */
  medium: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  },

  /**
   * Success or heavy interaction feedback
   */
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 50, 20]);
    }
  },

  /**
   * Warning or selection change feedback
   */
  selection: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }
};
