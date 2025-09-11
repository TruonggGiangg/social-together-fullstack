import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Card } from 'react-native-paper';
import { profileService } from '../services/profileService';
import { ProfileResponse, ProfileData } from '../types/profile.types';
import { logoutService } from '../services/logoutService';
import { useNavigation } from '@react-navigation/native';

export default function Tab5Screen() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await profileService.fetchProfile();
            setProfile(res);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutService.logout();
        // @ts-ignore
        navigation.replace('Login');
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const user: ProfileData | undefined = profile?.data;

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Thông tin tài khoản" />
                <Card.Content>
                    {loading ? <ActivityIndicator /> : null}
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    {user ? (
                        <>
                            <Text>Email: {user.email}</Text>
                            <Text>Tên: {user.name}</Text>
                            <Text>Role: {user.role}</Text>
                            <Text>User ID: {user._id}</Text>
                            <Text>iat: {user.iat}</Text>
                            <Text>exp: {user.exp}</Text>
                            <Text style={{ marginTop: 8, color: '#888' }}>Server time: {profile?.timestamp}</Text>
                        </>
                    ) : null}
                    <Button mode="outlined" onPress={fetchProfile} style={{ marginTop: 12 }}>
                        Làm mới
                    </Button>
                    <Button mode="contained" onPress={handleLogout} style={{ marginTop: 12 }}>
                        Đăng xuất
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        padding: 8,
    },
    error: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
});
