import { useState, useEffect } from 'react';

const useTheme = () => {
  // Get theme from localStorage or default to 'light'
  const getThemeFromStorage = () => {
    return localStorage.getItem('mui-mode') || 'light';
  };

  const [theme, setTheme] = useState(getThemeFromStorage);

  // Update theme state if localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(getThemeFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return theme;
};

export default useTheme;