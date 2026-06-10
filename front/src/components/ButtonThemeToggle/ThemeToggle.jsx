import {useContext} from 'react';
import ThemeContext from '../../context/ChangeTheme/ThemeContext';

import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <button className={styles.btnPremium} onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ ' : '🌙 '}
        </button>
    );
};

export default ThemeToggle;