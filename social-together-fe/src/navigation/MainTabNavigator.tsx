import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Tab1Screen from '../screens/Tab1Screen';
import Tab2Screen from '../screens/Tab2Screen';
import Tab3Screen from '../screens/Tab3Screen';
import Tab4Screen from '../screens/Tab4Screen';
import Tab5Screen from '../screens/Tab5Screen';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const theme = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurface,
                tabBarStyle: { backgroundColor: theme.colors.surface },
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'circle-outline';
                    if (route.name === 'Home') iconName = 'home';
                    if (route.name === 'Tab1') iconName = 'account-group';
                    if (route.name === 'Tab2') iconName = 'bell';
                    if (route.name === 'Tab3') iconName = 'message';
                    if (route.name === 'Tab4') iconName = 'video';
                    if (route.name === 'Tab5') iconName = 'menu';
                    return <Icon name={iconName} color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="Tab1" component={Tab1Screen} options={{ title: 'Bạn bè' }} />
            <Tab.Screen name="Tab2" component={Tab2Screen} options={{ title: 'Thông báo' }} />
            <Tab.Screen name="Tab3" component={Tab3Screen} options={{ title: 'Tin nhắn' }} />
            <Tab.Screen name="Tab4" component={Tab4Screen} options={{ title: 'Video' }} />
            <Tab.Screen name="Tab5" component={Tab5Screen} options={{ title: 'Menu' }} />
        </Tab.Navigator>
    );
}
