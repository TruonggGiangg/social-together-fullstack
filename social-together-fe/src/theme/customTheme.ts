import { MD3LightTheme as DefaultLightTheme, MD3DarkTheme as DefaultDarkTheme, MD3LightTheme } from 'react-native-paper';
import { facebookPalette, materialPalette, tealPalette, purplePalette } from './colorPalettes';

export type AppTheme = typeof MD3LightTheme;

export const lightTheme: AppTheme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        ...facebookPalette,
    },
};

export const darkTheme: AppTheme = {
    ...DefaultDarkTheme,
    colors: {
        ...DefaultDarkTheme.colors,
        ...facebookPalette,
        background: '#18191a',
        surface: '#242526',
        onBackground: '#e4e6eb',
        onSurface: '#e4e6eb',
    },
};

// Có thể export thêm các theme khác nếu muốn đổi bộ màu
export const materialLightTheme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        ...materialPalette,
    },
};

export const tealLightTheme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        ...tealPalette,
    },
};

export const purpleLightTheme = {
    ...DefaultLightTheme,
    colors: {
        ...DefaultLightTheme.colors,
        ...purplePalette,
    },
};
