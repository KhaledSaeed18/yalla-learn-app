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
                <Text numberOfLines={2} className="text-muted-foreground mt-1">
                    {listing.description}
                </Text>
                <View style={styles.footer}>
                    <Text numberOfLines={1} className="text-muted-foreground">
                        {listing.user.firstName} {listing.user.lastName.charAt(0)}.
                    </Text>
                    <View style={styles.condition}>
                        <Text className="text-muted-foreground">
                            {/* {listing.condition.replace('_', ' ')} */}
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
        borderRadius: 12,
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
        borderRadius: 4,
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
