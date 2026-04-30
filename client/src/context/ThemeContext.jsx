import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleRef = useRef(null); // Will be set by the toggle button

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback((e) => {
    // Get click coordinates for circle animation origin
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? 0;

    // Calculate the max radius needed to cover the entire screen
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Use View Transitions API if available for smooth circle animation
    if (document.startViewTransition) {
      document.documentElement.style.setProperty('--toggle-x', `${x}px`);
      document.documentElement.style.setProperty('--toggle-y', `${y}px`);
      document.documentElement.style.setProperty('--toggle-r', `${maxRadius}px`);

      const transition = document.startViewTransition(() => {
        setIsDark(prev => !prev);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      // Fallback: simple toggle without animation
      setIsDark(prev => !prev);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, toggleRef }}>
      {children}
    </ThemeContext.Provider>
  );
};
