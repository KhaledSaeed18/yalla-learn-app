import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../../components/ui/heading';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { router } from 'expo-router';
import { logout } from '@/utils/auth';
import { deleteAccount } from '@/services/user.service';
import { clearUser } from '@/redux/slices/userSlice';

export default function Tab() {
    const { currentUser } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const userFullName = currentUser ?
        `${currentUser.firstName} ${currentUser.lastName}` :
        'Guest User';

    const menuOptions = [
        {
            icon: "list-outline",
            title: "My Listings",
            onPress: () => router.push('/my-listings')
        },
        {
            icon: "briefcase-outline",
            title: "My Services",
            onPress: () => router.push('/my-services')
        },
        {
            icon: "lock-closed-outline",
            title: "Password & Security",
            onPress: () => router.push('/profile/change-password')
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

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount();
                            dispatch(clearUser());
                            await logout();
                            router.replace('/signin');
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete account. Please try again later.");
                            console.error("Error deleting account:", error);
                        }
                    }
                }
            ]
        );
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
                            </View>
                        </View>
                        <TouchableOpacity
                            className='bg-primary-500 rounded-lg px-3 py-2 flex-row items-center'
                            onPress={() => router.push('/profile/edit')}
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

                    {/* Delete Account Button */}
                    <TouchableOpacity
                        className='border-2 border-error-500 rounded-xl p-4 flex-row items-center justify-center mb-4'
                        onPress={handleDeleteAccount}
                    >
                        <Ionicons name="trash-outline" size={24} color="#ef4444" className='mr-2' />
                        <Text className='text-error-500 font-medium text-base'>Delete Account</Text>
                    </TouchableOpacity>

                    {/* Logout Button */}
                    <TouchableOpacity
                        className='bg-error-500 rounded-xl p-4 flex-row items-center justify-center'
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#fff" className='mr-2' />
                        <Text className='text-white font-medium text-base'>Logout</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}