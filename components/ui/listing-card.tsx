import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { ListingResponse } from '@/services/product.service';
import { formatCurrency } from '@/lib/utils';
import { Heading } from './heading';

interface ListingCardProps {
    listing: ListingResponse;
    onPress: (id: string) => void;
}

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Time periods in seconds
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
            style={styles.card}
            onPress={() => onPress(listing.id)}
            activeOpacity={0.7}
            className='border border-[#3B82F6]'
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: listing.images[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {listing.isRentable && (
                    <View style={styles.rentableBadge}>
                        <Heading className="text-white font-medium">For Rent</Heading>
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <Text numberOfLines={1} className="font-semibold text-base">
                    {listing.title}
                </Text>
                <Text className="text-[#3B82F6] text-xl font-bold">
                    {formatCurrency(listing.price)}{''}{listing.isRentable ? `/${listing.rentalPeriod} days` : ''}
                </Text>
                <Text numberOfLines={2} className="mt-1">
                    {listing.description}
                </Text>
                <View style={styles.footer}>
                    <View className='flex-row items-center'>
                        <Text numberOfLines={1} className="text-slate-500">
                            {listing.user.firstName} {listing.user.lastName}
                        </Text>
                        <Text>
                            {' - '}
                        </Text>
                        <Text numberOfLines={1} className="text-slate-500">
                            {formatRelativeTime(listing.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.condition}>
                        <Text className="text-slate-500">
                            {listing.category}
                        </Text>
                        <Text>
                            {' - '}
                        </Text>
                        <Text className="text-slate-500">
                            {listing.condition}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 160,
    },
    rentableBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#3B82F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    contentContainer: {
        padding: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    condition: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
