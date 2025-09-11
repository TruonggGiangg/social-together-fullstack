import React, { useState } from 'react';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, TextInput, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useLogin } from '../hooks/useLogin';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const FB_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const { login, loading, error } = useLogin();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const theme = useTheme();

    const handleLogin = async () => {
        Keyboard.dismiss();
        try {
            await login({ username, password });
            navigation.replace('MainTabs');
        } catch (e) { }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Image source={{ uri: FB_LOGO }} style={styles.logo} resizeMode="contain" />
                <Text style={[styles.title, { color: theme.colors.primary }]}>Đăng nhập Facebook</Text>
                <TextInput
                    label="Email hoặc số điện thoại"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="account" />}
                    returnKeyType="next"
                />
                <TextInput
                    label="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    mode="outlined"
                    secureTextEntry
                    left={<TextInput.Icon icon="lock" />}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {loading ? (
                    <ActivityIndicator animating color={theme.colors.primary} />
                ) : (
                    <Button mode="contained" onPress={handleLogin} style={styles.button} contentStyle={{ paddingVertical: 6 }}>
                        Đăng nhập
                    </Button>
                )}
                <Button mode="text" onPress={() => { }} style={styles.forgot} labelStyle={{ color: theme.colors.primary }}>
                    Quên mật khẩu?
                </Button>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        marginBottom: 14,
    },
    button: {
        width: '100%',
        marginTop: 8,
        borderRadius: 6,
    },
    forgot: {
        marginTop: 12,
    },
    error: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
});
