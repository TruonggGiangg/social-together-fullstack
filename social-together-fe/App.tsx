import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function Main() {
  const { theme } = useAppTheme();
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
