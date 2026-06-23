import { useContext } from 'react';
import ThemeContext from '../../context/ChangeTheme/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button className={styles.switch} onClick={toggleTheme} aria-label="Cambiar tema">
      <span className={`${styles.option} ${!isDark ? styles.active : ''}`}>☀️</span>
      <span className={`${styles.option} ${isDark ? styles.active : ''}`}>🌙</span>
    </button>
  );
};

export default ThemeToggle;
