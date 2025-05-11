import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
    return (
        <SafeAreaProvider>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3b82f6',
            }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <FontAwesome size={25} name="home" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="listings"
                    options={{
                        title: 'Listings',
                        tabBarIcon: ({ color }) => <FontAwesome size={25} name="shopping-cart" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="add"
                    options={{
                        title: 'Add',
                        tabBarIcon: ({ color }) => <FontAwesome size={25} name="plus-circle" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="services"
                    options={{
                        title: 'Services',
                        tabBarIcon: ({ color }) => <FontAwesome size={25} name="briefcase" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="menu"
                    options={{
                        title: 'Menu',
                        tabBarIcon: ({ color }) => <FontAwesome size={25} name="bars" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="add-product"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="add-service"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="listing-details"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="my-services"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="my-listings"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="service/[id]"
                    options={{
                        href: null,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="listing/[id]"
                    options={{
                        href: null,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="profile/edit"
                    options={{
                        href: null,
                        headerShown: false,
                    }}
                />
            </Tabs>
        </SafeAreaProvider>
    );
}
