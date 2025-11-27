import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        temperature: {
          cold: "hsl(var(--temperature-cold))",
          "cold-foreground": "hsl(var(--temperature-cold-foreground))",
          warm: "hsl(var(--temperature-warm))",
          "warm-foreground": "hsl(var(--temperature-warm-foreground))",
          hot: "hsl(var(--temperature-hot))",
          "hot-foreground": "hsl(var(--temperature-hot-foreground))",
        },
        priority: {
          high: "hsl(var(--priority-high))",
          "high-foreground": "hsl(var(--priority-high-foreground))",
          medium: "hsl(var(--priority-medium))",
          "medium-foreground": "hsl(var(--priority-medium-foreground))",
          low: "hsl(var(--priority-low))",
          "low-foreground": "hsl(var(--priority-low-foreground))",
        },
        kanban: {
          cold: "hsl(var(--kanban-cold))",
          interested: "hsl(var(--kanban-interested))",
          demo: "hsl(var(--kanban-demo))",
          test: "hsl(var(--kanban-test))",
          won: "hsl(var(--kanban-won))",
          lost: "hsl(var(--kanban-lost))",
          "problem-detected": "hsl(var(--kanban-problem-detected))",
          "discovery-call": "hsl(var(--kanban-discovery-call))",
          proposal: "hsl(var(--kanban-proposal))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
