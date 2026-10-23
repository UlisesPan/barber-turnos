import { useTheme } from '../../context/ChangeTheme/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className={styles.switch}
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={isDark}
    >
      <span className={`${styles.option} ${!isDark ? styles.active : ''}`} aria-hidden="true">☀️</span>
      <span className={`${styles.option} ${isDark ? styles.active : ''}`} aria-hidden="true">🌙</span>
    </button>
  );
};

export default ThemeToggle;
