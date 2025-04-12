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
                name="listings"
                options={{
                    title: 'Listings',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus-circle" color={color} />,
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="briefcase" color={color} />,
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
