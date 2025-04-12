import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'red',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: 'menu',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="bars" color={color} />,
                }}
            />
        </Tabs>
    );
}
