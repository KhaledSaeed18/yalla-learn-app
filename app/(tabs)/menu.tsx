import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Tab() {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=8"
    };

    // Menu options
    const menuOptions = [
        {
            icon: "settings-outline",
            title: "Settings",
            onPress: () => console.log("Settings")
        },
        {
            icon: "notifications-outline",
            title: "Notifications",
            onPress: () => console.log("Notifications")
        },
        {
            icon: "help-circle-outline",
            title: "Help & Support",
            onPress: () => console.log("Help")
        },
        {
            icon: "information-circle-outline",
            title: "About",
            onPress: () => console.log("About")
        },
        {
            icon: "shield-outline",
            title: "Privacy & Security",
            onPress: () => console.log("Privacy")
        },
    ];

    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <ScrollView className='flex-1'>
                <View className='px-4'>
                    {/* User Profile Section */}
                    <View className='bg-white rounded-xl p-4 mb-6 flex-row items-center justify-between'>
                        <View className='flex-row items-center'>
                            {user.avatarUrl ? (
                                <Image
                                    source={{ uri: user.avatarUrl }}
                                    className='w-16 h-16 rounded-full mr-4'
                                />
                            ) : (
                                <View className='w-16 h-16 rounded-full bg-gray-300 mr-4 items-center justify-center'>
                                    <Ionicons name="person" size={30} color="#666" />
                                </View>
                            )}
                            <View>
                                <Text className='text-lg font-bold text-typography-700'>{user.name}</Text>
                                <Text className='text-typography-500'>{user.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className='bg-[#3b82f6] rounded-lg px-3 py-2 flex-row items-center'
                            onPress={() => console.log("Edit profile")}
                        >
                            <Ionicons name="pencil-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                            <Text className='text-white font-medium'>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Options List */}
                    <View className='bg-white rounded-xl overflow-hidden mb-6'>
                        {menuOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`p-4 flex-row items-center border-b border-[#3b83f664] ${index === menuOptions.length - 1 ? 'border-b-0' : ''
                                    }`}
                                onPress={option.onPress}
                            >
                                <Ionicons name={option.icon as any} size={24} color="#666" className='mr-4' />
                                <Text className='text-typography-600 text-base flex-1'>{option.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        className='bg-white rounded-xl p-4 flex-row items-center justify-center mb-8'
                        onPress={() => console.log("Logout")}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#f44336" className='mr-2' />
                        <Text className='text-red-500 font-medium text-base'>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}