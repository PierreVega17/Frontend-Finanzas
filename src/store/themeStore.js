import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('isDarkMode');
    if (saved !== null) {
      return saved === 'true';
    }
  }
  return false; // default light mode
};

const useThemeStore = create((set) => ({
  isDarkMode: getInitialTheme(),
  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('isDarkMode', newMode.toString());
        if (newMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
      return { isDarkMode: newMode };
    });
  },
  setLightTheme: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isDarkMode', 'false');
      document.documentElement.removeAttribute('data-theme');
    }
    set({ isDarkMode: false });
  },
  setDarkTheme: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isDarkMode', 'true');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    set({ isDarkMode: true });
  },
}));

// Set initial data-theme attribute on load
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('isDarkMode');
  if (saved === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export default useThemeStore;
