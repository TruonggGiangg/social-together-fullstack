import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card, IconButton, Switch } from 'react-native-paper';
import { useAppTheme } from '../theme/ThemeContext';

export default function HomeScreen() {
    const { mode, setMode, isDark } = useAppTheme();
    const theme = useTheme();

    // Hàm đổi mode
    const toggleMode = () => {
        if (mode === 'system') setMode(isDark ? 'light' : 'dark');
        else if (mode === 'light') setMode('dark');
        else setMode('light');
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modeRow}>
                <IconButton
                    icon={isDark ? 'weather-night' : 'white-balance-sunny'}
                    size={28}
                    onPress={toggleMode}
                    accessibilityLabel="Toggle dark/light mode"
                />
                <Text style={{ marginLeft: 8 }}>
                    {mode === 'system' ? 'Theo hệ thống' : isDark ? 'Dark mode' : 'Light mode'}
                </Text>
                <Switch value={isDark} onValueChange={toggleMode} style={{ marginLeft: 8 }} />
            </View>
            <Card style={styles.card}>
                <Card.Title title="Home" />
                <Card.Content>
                    <Text variant="bodyMedium">Đây là trang Home. Bạn có thể phát triển thêm nội dung tại đây.</Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        padding: 8,
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        alignSelf: 'flex-end',
    },
});
