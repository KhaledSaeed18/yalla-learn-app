import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from "@/components/ui/text"

export default function Tab() {
    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <View className=''>
                <Text className='text-xl font-bold mb-2 text-typography-700'>Home</Text>
            </View>
        </SafeAreaView>
    );
}