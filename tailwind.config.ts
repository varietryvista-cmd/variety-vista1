import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra-Minimal Luxury — Gold Architect Palette
        // Near-black, warm white, stone gray, gold accent
        brand: {
          bg: "#FAFAF9",
          "bg-alt": "#F5F4F2",
          "bg-card": "#FAFAF9",
          primary: "#0A0A0A",
          "primary-light": "#1A1A1A",
          "primary-muted": "#8B8680",
          cta: "#B8913A",
          "cta-hover": "#A07D2E",
          "cta-light": "#D4B86A",
          secondary: "#8B8680",
          "secondary-light": "#C5C0B8",
          border: "rgba(10, 10, 10, 0.06)",
          "border-strong": "rgba(10, 10, 10, 0.12)",
          "surface-dark": "#0A0A0A",
        },
        // Universal color aliases used across storefront components
        "primary-text": "#0A0A0A",
        "secondary-text": "#8B8680",
        "tertiary-text": "#8B8680",
        "primary-bg": "#FAFAF9",
        "secondary-bg": "#F5F4F2",
        // Semantic colors
        sale: "#C42B2B",
        success: "#1E8E3E",
        warning: "#E08A00",
        // Legacy denim scale (mapped to gold)
        denim: {
          DEFAULT: "#B8913A",
          light: "#D4B86A",
          dark: "#A07D2E",
          50: "#FBF8F0",
          100: "#F3EDDA",
          200: "#E7DBB5",
          300: "#D4B86A",
          400: "#C4A34E",
          500: "#B8913A",
          600: "#A07D2E",
          700: "#8A6B25",
          800: "#6E551D",
          900: "#524016",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        // Ultra-minimal type scale — larger, calmer
        "display-large": ["clamp(4.5rem, 12vw, 10rem)", { lineHeight: "0.88", fontWeight: "700", letterSpacing: "-0.04em" }],
        "display-medium": ["clamp(3.5rem, 7vw, 6rem)", { lineHeight: "0.92", fontWeight: "700", letterSpacing: "-0.03em" }],
        "hero": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.02em" }],
        "section": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.02em" }],
        "product-title": ["0.9375rem", { lineHeight: "1.3", fontWeight: "500", letterSpacing: "0.01em" }],
        "product-price": ["0.9375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "caption": ["0.6875rem", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.15em" }],
      },
      letterSpacing: {
        "tightest": "-.075em",
        "ultra-tight": "-.1em",
        "luxury": "0.15em",
        "luxury-wide": "0.2em",
      },
      maxWidth: {
        site: "1400px",
      },
      spacing: {
        "section-sm": "80px",
        "section": "128px",
        "section-lg": "160px",
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "pulse-badge": "pulse-badge 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slide-down 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 0.5s ease-out",
        "count-up": "count-up 0.6s ease-out",
        "progress-shrink": "progress-shrink 3s linear forwards",
        "draw-underline": "draw-underline 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-badge": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "count-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "progress-shrink": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        "draw-underline": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      transitionTimingFunction: {
        "brand": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "luxury": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
