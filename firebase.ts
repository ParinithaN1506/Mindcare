@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
@import "tailwindcss";

@theme {
  --color-brand-50: #f0f4ff;
  --color-brand-100: #e1e9ff;
  --color-brand-200: #c8d7ff;
  --color-brand-300: #a1b8ff;
  --color-brand-400: #708aff;
  --color-brand-500: #4859ff;
  --color-brand-600: #2b2fff;
  --color-brand-700: #1d1ce7;
  --color-brand-800: #1a19bb;
  --color-brand-900: #1c1c93;
  --color-brand-950: #101056;

  --font-display: "Outfit", sans-serif;
  --font-sans: "Inter", sans-serif;
}

:root {
  --background: #ffffff;
  --foreground: #030214;
  --indigo-glow: rgba(79, 70, 229, 0.1);
  --purple-glow: rgba(147, 51, 234, 0.1);
  --glass: rgba(0, 0, 0, 0.05);
  --glass-border: rgba(0, 0, 0, 0.1);
}

.dark {
  --background: #030214;
  --foreground: #f8fafc;
  --indigo-glow: rgba(79, 70, 229, 0.2);
  --purple-glow: rgba(147, 51, 234, 0.2);
  --glass: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  margin: 0;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.glass {
  background: var(--glass);
  backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.bg-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

@layer base {
  * {
    @apply border-white/10;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-[#030214];
}

::-webkit-scrollbar-thumb {
  @apply bg-white/10 rounded-full hover:bg-white/20;
}
