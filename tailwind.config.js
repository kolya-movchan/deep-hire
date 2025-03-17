import tailwindcssAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary-hue), 80%, 50% / <alpha-value>)",
          foreground: "hsl(var(--primary-hue), 10%, 98% / <alpha-value>)",
          hover: "hsl(var(--primary-hue), 80%, 45% / <alpha-value>)",
          focus: "hsl(var(--primary-hue), 85%, 55% / <alpha-value>)",
          muted: "hsl(var(--primary-hue), 60%, 95% / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary-hue), 70%, 55% / <alpha-value>)",
          foreground: "hsl(var(--secondary-hue), 10%, 98% / <alpha-value>)",
          hover: "hsl(var(--secondary-hue), 70%, 50% / <alpha-value>)",
          focus: "hsl(var(--secondary-hue), 75%, 60% / <alpha-value>)",
          muted: "hsl(var(--secondary-hue), 60%, 95% / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent-hue), 80%, 55% / <alpha-value>)",
          foreground: "hsl(var(--accent-hue), 10%, 98% / <alpha-value>)",
          hover: "hsl(var(--accent-hue), 80%, 50% / <alpha-value>)",
          focus: "hsl(var(--accent-hue), 85%, 60% / <alpha-value>)",
          muted: "hsl(var(--accent-hue), 60%, 95% / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(240, 10%, 94% / <alpha-value>)",
          foreground: "hsl(240, 10%, 40% / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success-hue), 65%, 48% / <alpha-value>)",
          foreground: "hsl(var(--success-hue), 10%, 98% / <alpha-value>)",
          muted: "hsl(var(--success-hue), 65%, 95% / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--info-hue), 90%, 55% / <alpha-value>)",
          foreground: "hsl(var(--info-hue), 10%, 10% / <alpha-value>)",
          muted: "hsl(var(--info-hue), 90%, 95% / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning-hue), 90%, 55% / <alpha-value>)",
          foreground: "hsl(var(--warning-hue), 10%, 10% / <alpha-value>)",
          muted: "hsl(var(--warning-hue), 90%, 95% / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger-hue), 90%, 50% / <alpha-value>)",
          foreground: "hsl(var(--danger-hue), 10%, 98% / <alpha-value>)",
          muted: "hsl(var(--danger-hue), 90%, 95% / <alpha-value>)",
        },
        border: "hsl(240, 10%, 90% / <alpha-value>)",
        input: "hsl(240, 10%, 90% / <alpha-value>)",
        ring: "hsl(var(--primary-hue), 80%, 60% / <alpha-value>)",
        chart: {
          1: "hsl(var(--primary-hue), 80%, 50% / <alpha-value>)",
          2: "hsl(var(--secondary-hue), 70%, 55% / <alpha-value>)",
          3: "hsl(var(--accent-hue), 80%, 55% / <alpha-value>)",
          4: "hsl(var(--success-hue), 65%, 48% / <alpha-value>)",
          5: "hsl(var(--warning-hue), 90%, 55% / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--primary-hue), 20%, 18% / <alpha-value>)",
          foreground: "hsl(var(--primary-hue), 10%, 98% / <alpha-value>)",
          primary: "hsl(var(--primary-hue), 80%, 50% / <alpha-value>)",
          "primary-foreground": "hsl(var(--primary-hue), 10%, 98% / <alpha-value>)",
          accent: "hsl(var(--primary-hue), 15%, 25% / <alpha-value>)",
          "accent-foreground": "hsl(var(--primary-hue), 10%, 90% / <alpha-value>)",
          border: "hsl(var(--primary-hue), 20%, 25% / <alpha-value>)",
          ring: "hsl(var(--primary-hue), 80%, 60% / <alpha-value>)",
        },
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        none: "none",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.5s ease-out forwards",
        "slide-left": "slideLeft 0.5s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
