import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Tab() {
    return (
        <SafeAreaView className='bg-red-400 flex-1'>
            <View className='bg-blue-400'>
                <Text className='text-xl font-bold mb-2 text-typography-700'>Home</Text>
            </View>
        </SafeAreaView>
    );
}