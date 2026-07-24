/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',         // midnight purple #1A1625
        foreground: 'var(--color-foreground)',         // warm white #E8E6F0

        card: {
          DEFAULT: 'var(--color-card)',                // surface #2A2438
          foreground: 'var(--color-card-foreground)',  // warm white #E8E6F0
        },

        popover: {
          DEFAULT: 'var(--color-popover)',             // surface #2A2438
          foreground: 'var(--color-popover-foreground)', // warm white #E8E6F0
        },

        primary: {
          DEFAULT: 'var(--color-primary)',             // golden #D4AF37
          foreground: 'var(--color-primary-foreground)', // midnight #1A1625
        },

        secondary: {
          DEFAULT: 'var(--color-secondary)',           // bronze #8B7355
          foreground: 'var(--color-secondary-foreground)', // white #FFFFFF
        },

        accent: {
          DEFAULT: 'var(--color-accent)',              // coral #FF6B6B
          foreground: 'var(--color-accent-foreground)', // white #FFFFFF
        },

        muted: {
          DEFAULT: 'var(--color-muted)',               // elevated surface #3A3448
          foreground: 'var(--color-muted-foreground)', // muted lavender #B8B5C8
        },

        destructive: {
          DEFAULT: 'var(--color-destructive)',         // soft red #FF8E8E
          foreground: 'var(--color-destructive-foreground)', // midnight #1A1625
        },

        success: {
          DEFAULT: 'var(--color-success)',             // teal #4ECDC4
          foreground: 'var(--color-success-foreground)', // midnight #1A1625
        },

        warning: {
          DEFAULT: 'var(--color-warning)',             // warm yellow #FFE66D
          foreground: 'var(--color-warning-foreground)', // midnight #1A1625
        },

        error: {
          DEFAULT: 'var(--color-error)',               // soft red #FF8E8E
          foreground: 'var(--color-error-foreground)', // midnight #1A1625
        },

        border: 'var(--color-border)',                 // golden tint rgba(212,175,55,0.2)
        input: 'var(--color-input)',                   // surface #2A2438
        ring: 'var(--color-ring)',                     // golden #D4AF37

        surface: {
          0: 'var(--color-surface-0)',                 // base #1A1625
          1: 'var(--color-surface-1)',                 // card #2A2438
          2: 'var(--color-surface-2)',                 // elevated #3A3448
          3: 'var(--color-surface-3)',                 // highest #4A4458
        },
      },

      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
        caption: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        data: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },

      fontSize: {
        'display': ['3rem', { lineHeight: '1.1' }],
        'h2': ['2.25rem', { lineHeight: '1.2' }],
        'h3': ['1.75rem', { lineHeight: '1.25' }],
        'h4': ['1.375rem', { lineHeight: '1.3' }],
        'h5': ['1.125rem', { lineHeight: '1.4' }],
        'caption': ['0.875rem', { lineHeight: '1.45', letterSpacing: '0.025em' }],
      },

      spacing: {
        '1.5': '6px',   // space-1
        '3': '12px',    // space-2
        '4.5': '18px',  // space-3
        '6': '24px',    // space-4
        '9': '36px',    // space-5
        '12': '48px',   // space-6
        '18': '72px',   // space-7
        '24': '96px',   // space-8
        '36': '144px',  // space-9
      },

      borderRadius: {
        'sm': '6px',    // ticket-stub sm
        'md': '12px',   // card radius
        'lg': '18px',   // modal radius
        'xl': '24px',   // large components
      },

      boxShadow: {
        'sm': '0 2px 4px rgba(26, 22, 37, 0.4)',
        'md': '0 3px 6px rgba(26, 22, 37, 0.4), 0 1px 3px rgba(212, 175, 55, 0.15)',
        'lg': '0 6px 12px rgba(26, 22, 37, 0.4), 0 2px 6px rgba(212, 175, 55, 0.15)',
        'xl': '0 12px 24px rgba(26, 22, 37, 0.4), 0 4px 12px rgba(212, 175, 55, 0.15)',
        '2xl': '0 32px 64px -16px rgba(26, 22, 37, 0.6), 0 8px 24px rgba(212, 175, 55, 0.1)',
        'golden': '0 0 12px rgba(212, 175, 55, 0.3)',
        'golden-lg': '0 0 24px rgba(212, 175, 55, 0.4)',
      },

      transitionTimingFunction: {
        'cinema': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      transitionDuration: {
        '250': '250ms',
      },

      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in-up': 'fadeInUp 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'modal-enter': 'modalEnter 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalEnter: {
          from: { opacity: '0', transform: 'translateY(-16px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },

      zIndex: {
        'nav': '100',
        'fab': '200',
        'modal': '200',
        'toast': '300',
      },

      height: {
        'nav': '64px',
        'nav-mobile': '56px',
        'touch': '48px',
      },

      minWidth: {
        'touch': '48px',
      },

      minHeight: {
        'touch': '48px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};