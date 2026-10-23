import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
