module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
            fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        },
      colors: {
        primary: '#0E1015',
        tableBg: '#1C1F26',
        tableHeader: '#2F333D',
        verified: '#22c55e',
        unverified: '#ef4444',
        pending: '#f59e0b',
        blacklisted: '#ef4444',
        disabled: '#6b7280',
        

        // Font colors
        textPrimary: '#ffffff',
        textSecondary: '#d1d5db', // Tailwind's zinc-300
        textMuted: '#9ca3af',     // Tailwind's gray-400
      },
    },
  },
  plugins: [],
}
