import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import { ListingResponse } from '@/types/service/product.types';

interface ListingCardProps {
    listing: ListingResponse;
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

export const ListingCard = ({ listing, onPress }: ListingCardProps) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(listing.id)}
            activeOpacity={0.8}
            className='bg-slate-100 rounded-xl overflow-hidden mb-5 shadow-lg'
        >
            <View className='relative'>
                <Image
                    source={{ uri: listing.images[0] }}
                    className='w-full h-48'
                    resizeMode="cover"
                />
                {listing.isRentable && (
                    <View className='absolute top-3 right-3 bg-[#3B82F6] px-3 py-1 rounded-full shadow-sm'>
                        <Text className="text-white font-medium text-xs">FOR RENT</Text>
                    </View>
                )}
                <View className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent' />
            </View>

            <View className='p-4'>
                <View className='flex-row justify-between items-start'>
                    <Text numberOfLines={1} className="font-bold text-lg">
                        {listing.title}
                    </Text>
                    <Text className="text-[#3B82F6] text-lg font-bold">
                        {formatCurrency(listing.price)}
                        {listing.isRentable && (
                            <Text className="text-[#3B82F6] text-lg font-medium mt-1">
                                {`/${listing.rentalPeriod} days`}
                            </Text>
                        )}
                    </Text>
                </View>

                <Text numberOfLines={2} className="mt-2 text-gray-700">
                    {listing.description}
                </Text>

                <View className='flex-row justify-between mt-3 pt-3 border-t border-gray-100'>
                    <View className='flex-row items-center space-x-1'>
                        <View className='bg-gray-100 px-2 py-1 rounded-md'>
                            <Text className="text-gray-700 text-xs">
                                {listing.category}
                            </Text>
                        </View>
                        <View className='bg-gray-100 px-2 py-1 rounded-md'>
                            <Text className="text-gray-700 text-xs">
                                {listing.condition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                            </Text>
                        </View>
                    </View>
                    <View className='flex-row items-center'>
                        <Text numberOfLines={1} className="text-gray-500 text-xs">
                            By {listing.user.firstName} {listing.user.lastName} • {formatRelativeTime(listing.createdAt)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};


