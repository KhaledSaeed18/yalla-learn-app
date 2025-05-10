import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import { ServiceResponse } from '@/types/service/service.types';

interface ServiceCardProps {
    service: ServiceResponse;
    onPress: (id: string) => void;
}

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diffInSeconds < minute) {
        return 'just now';
    } else if (diffInSeconds < hour) {
        const minutes = Math.floor(diffInSeconds / minute);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < day) {
        const hours = Math.floor(diffInSeconds / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < week) {
        const days = Math.floor(diffInSeconds / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diffInSeconds < month) {
        const weeks = Math.floor(diffInSeconds / week);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInSeconds < year) {
        const months = Math.floor(diffInSeconds / month);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffInSeconds / year);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
};

const formatCategory = (category: string): string => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export function ServiceCard({ service, onPress }: ServiceCardProps) {
    const isOffering = service.direction === 'OFFERING';

    return (
        <TouchableOpacity
            onPress={() => onPress(service.id)}
            activeOpacity={0.8}
            className='bg-white rounded-xl overflow-hidden mb-5 shadow-sm border border-gray-100'
        >
            <View className={`h-2 w-full ${isOffering ? 'bg-emerald-500' : 'bg-amber-500'}`} />

            <View className='p-4'>
                <View className='flex-row justify-between items-start'>
                    <View className='flex-1 pr-2'>
                        <Text numberOfLines={1} className="font-bold text-lg">
                            {service.title}
                        </Text>
                        <View className='flex-row items-center mt-1'>
                            <View className={`px-2 py-1 rounded-md ${isOffering ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                <Text className={`text-xs ${isOffering ? 'text-emerald-700' : 'text-amber-700'}`}>
                                    {isOffering ? 'Offering' : 'Requesting'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {service.price !== null && (
                        <Text className="text-[#3B82F6] text-lg font-bold">
                            {formatCurrency(service.price || 0)}
                        </Text>
                    )}
                </View>

                <Text numberOfLines={2} className="mt-2 text-gray-700">
                    {service.description}
                </Text>

                <View className='flex-row justify-between mt-3 pt-3 border-t border-gray-100'>
                    <View className='flex-row items-center space-x-1'>
                        <View className='bg-gray-100 px-2 py-1 rounded-md'>
                            <Text className="text-gray-700 text-xs">
                                {formatCategory(service.category)}
                            </Text>
                        </View>
                    </View>
                    <View className='flex-row items-center'>
                        <Text numberOfLines={1} className="text-gray-500 text-xs">
                            By {service.user?.firstName || 'Anonymous'} {service.user?.lastName || ''} • {formatRelativeTime(service.createdAt)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
