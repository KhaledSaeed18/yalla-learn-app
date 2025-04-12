import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = () => {
    return (
        <SafeAreaView className='bg-background-0 flex-1'>
            <View className=''>
                <Text className='text-xl font-bold mb-2 text-typography-700'>Services</Text>
            </View>
        </SafeAreaView>
    );
}

export default services;