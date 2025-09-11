import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import { secureStorage } from '../utils/secureStorage';
import { setNavigationRef } from '../api/axiosClient';

export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function AppNavigator() {
    const [initialRoute, setInitialRoute] = useState<'Login' | 'MainTabs' | null>(null);

    useEffect(() => {
        setNavigationRef(navigationRef);
        return () => setNavigationRef(null);
    }, []);

    useEffect(() => {
        const checkToken = async () => {
            const token = await secureStorage.getAccessToken();
            setInitialRoute(token ? 'MainTabs' : 'Login');
        };
        checkToken();
    }, []);

    if (!initialRoute) return null;

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
