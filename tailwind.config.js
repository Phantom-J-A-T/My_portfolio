/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Controlled by the ThemeProvider attaching the "dark" class
  theme: {
    extend: {
      colors: {
        // DARK MODE: "Futuristic Cyber-Noir / Hacker" Aesthetic
        cyber: {
          midnight: "#060813", // Main background (Midnight Blue/Black)
          red: {
            DEFAULT: "#DC2626", // Crimson Accent
            glow: "#EF4444",    // Bright alert red highlighting
          }
        },
        // LIGHT MODE: "Clean, High-Tech Corporate / Sci-Fi Lab" Aesthetic
        corporate: {
          white: "#FFFFFF",
          iceWhite: "#F8FAFC", // Main background (Crisp Ice Blue/White)
          blue: {
            DEFAULT: "#2563EB", // Vibrant blue accent
            glow: "#3B82F6",    // High-tech electric highlights
          }
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'red-cyber': '0 0 20px rgba(220, 38, 38, 0.25)',
        'blue-corporate': '0 0 20px rgba(37, 99, 235, 0.15)',
      }
    },
  },
  plugins: [],
}
