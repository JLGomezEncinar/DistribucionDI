import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const THEME_KEY = '@user_theme_mode';

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    };
    loadTheme();
  }, []);

  // Función para cambiar el tema y guardarlo
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
  };

  // Definición de colores
  const theme = {
    background: isDarkMode ? '#121212' : '#f5f5f5',
    text: isDarkMode ? '#ffffff' : '#2c3e50',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    primary: '#3498db'
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);