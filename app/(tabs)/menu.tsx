import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../../components/ui/heading';
import { useAppSelector } from '@/redux/hooks';
import { router } from 'expo-router';
import { logout } from '@/utils/auth';

export default function Tab() {
    const { currentUser } = useAppSelector(state => state.user);

    const userFullName = currentUser ?
        `${currentUser.firstName} ${currentUser.lastName}` :
        'Guest User';

    const menuOptions = [
        {
            icon: "list-outline",
            title: "My Listings",
            onPress: () => router.push('/listings')
        },
        {
            icon: "briefcase-outline",
            title: "My Services",
            onPress: () => router.push('/services')
        },
        {
            icon: "settings-outline",
            title: "Settings",
            onPress: () => console.log("Settings")
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
    ];

    const handleLogout = async () => {
        await logout();
        router.replace('/signin');
    };

    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <ScrollView className='flex-1'>
                <View className='px-4'>
                    {/* Page Title */}
                    <Heading size="xl" className="my-4 text-typography-900">
                        Account & Settings
                    </Heading>

                    {/* User Profile Section */}
                    <View className='bg-background-0 rounded-xl p-4 mb-6 flex-row items-center justify-between'>
                        <View className='flex-row items-center'>
                            {currentUser?.avatar ? (
                                <View className='w-16 h-16 rounded-full mr-4 overflow-hidden'>
                                    <Image
                                        source={{ uri: currentUser.avatar }}
                                        className='w-full h-full'
                                        resizeMode='cover'
                                        alt="User Avatar"
                                    />
                                </View>
                            ) : (
                                <View className='w-16 h-16 rounded-full bg-background-200 mr-4 items-center justify-center'>
                                    <Ionicons name="person" size={30} color="#666" />
                                </View>
                            )}
                            <View>
                                <Text className='text-lg font-bold text-typography-700'>{userFullName}</Text>
                                <Text className='text-typography-500'>{currentUser?.email || 'N/A'}</Text>
                                {currentUser?.location && (
                                    <Text className='text-typography-500'>{currentUser.location}</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity
                            className='bg-primary-500 rounded-lg px-3 py-2 flex-row items-center'
                            onPress={() => console.log("Edit profile")}
                        >
                            <Ionicons name="pencil-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                            <Text className='text-white font-medium'>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Options List */}
                    <View className='bg-background-0 rounded-xl overflow-hidden mb-6 shadow-soft-1'>
                        {menuOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`p-4 flex-row items-center border-b border-outline-200 ${index === menuOptions.length - 1 ? 'border-b-0' : ''
                                    }`}
                                onPress={option.onPress}
                            >
                                <Ionicons name={option.icon as any} size={24} color="#3b82f6" className='mr-4' />
                                <Text className='text-typography-600 text-base flex-1'>{option.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        className='bg-background-0 rounded-xl p-4 flex-row items-center justify-center mb-8'
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#f44336" className='mr-2' />
                        <Text className='text-error-600 font-medium text-base'>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}