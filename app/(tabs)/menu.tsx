import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Tab() {
    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <View className=''>
                <Text className='text-xl font-bold mb-6 text-typography-700'>Menu</Text>
            </View>
        </SafeAreaView>
    );
}