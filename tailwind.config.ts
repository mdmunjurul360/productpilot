import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Charcoal for high-contrast, fatigue-free typography
        charcoal: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0B0F19', // Primary Deep Charcoal
        },
        // Sophisticated Slate for architectural surfaces & depth
        slateSurface: {
          50: '#F8FAFC',  // Canvas background
          100: '#F1F5F9', // Muted card background
          200: '#E2E8F0', // Crisp border stroke
          300: '#CBD5E1', // Active border stroke
          400: '#94A3B8', // Muted text/metadata
          500: '#64748B', // Secondary text
          600: '#475569', // Article prose text
          700: '#334155', // Subheadings
          800: '#1E293B', // Dark card container
          900: '#0F172A', // Dark navbar / footer
          950: '#020617', // Midnight hero accents
        },
        // Vibrant Action Palette for high-converting Affiliate CTAs
        affiliate: {
          DEFAULT: '#10B981',       // High-converting emerald action
          hover: '#059669',         // Deep action green
          active: '#047857',        // Pressed state
          glow: 'rgba(16, 185, 129, 0.25)', // CTA focus ring / glow
          // Marketplace-specific branded action colors
          amazon: '#FF9900',        // Amazon Prime Gold
          'amazon-hover': '#E68A00',
          ebay: '#0064D2',          // eBay Blue
          'ebay-hover': '#0053B0',
          'ebay-red': '#E53238',
          aliexpress: '#FF4747',    // AliExpress Coral Red
          'aliexpress-hover': '#E63939',
          daraz: '#F85606',         // Daraz Orange
          'daraz-hover': '#DF4A00',
        },
        // Brand Primary (ProductPilot Sapphire)
        pilot: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Rating & Metric Accents
        rating: {
          amber: '#F59E0B',
          pro: '#10B981',
          con: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 4px 6px -2px rgba(15, 23, 42, 0.02)',
        'elevated': '0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 8px 10px -4px rgba(15, 23, 42, 0.04)',
        'affiliate-cta': '0 8px 24px -4px rgba(16, 185, 129, 0.35)',
        'amazon-cta': '0 8px 24px -4px rgba(255, 153, 0, 0.35)',
      },
      borderRadius: {
        'luxury': '18px',
      },
    },
  },
  plugins: [],
};

export default config;
