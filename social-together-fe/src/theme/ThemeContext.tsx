import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './customTheme';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextProps {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    theme: typeof lightTheme;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    const isDark = useMemo(() => (mode === 'system' ? systemScheme === 'dark' : mode === 'dark'), [mode, systemScheme]);
    const theme = isDark ? darkTheme : lightTheme;

    const value = useMemo(() => ({ mode, setMode, theme, isDark }), [mode, theme, isDark]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
    return ctx;
};
