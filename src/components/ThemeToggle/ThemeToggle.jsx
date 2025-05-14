import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = ({ isLoginPage }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={isLoginPage ? `${styles.themeToggle} ${styles.loginThemeToggle}` : styles.themeToggle} 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;