import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { ListingCategory, Condition } from '@/types/enums';

// Mock data for listings - this would ideally come from a database or API
// Extending the mock data to include user information
const mockListings = [
    {
        id: '1',
        title: 'MacBook Pro M2 2023',
        price: 1299,
        condition: Condition.LIKE_NEW,
        category: ListingCategory.ELECTRONICS,
        isRentable: true,
        rentalPrice: 35,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Excellent condition MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. This laptop is perfect for students and professionals alike. The battery health is at 98% and it comes with the original charger. Im selling because Im upgrading to the new model.',
        location: 'University Campus, Building B',
        datePosted: '2023-10-15',
        user: {
            id: 'u1',
            name: 'Alex Johnson',
            email: 'alex.j@university.edu',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            joinDate: 'September 2022',
            rating: 4.8,
            totalListings: 7
        }
    },
    {
        id: '2',
        title: 'Calculus Textbook 8th Edition',
        price: 75,
        condition: Condition.GOOD,
        category: ListingCategory.BOOKS,
        isRentable: true,
        rentalPrice: 15,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Calculus: Early Transcendentals by James Stewart, 8th edition. Some highlighting inside but overall in good condition. Perfect for Calculus I and II courses.',
        location: 'Math Department',
        datePosted: '2023-11-05',
        user: {
            id: 'u2',
            name: 'Sarah Miller',
            email: 'sarah.m@university.edu',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            joinDate: 'January 2023',
            rating: 4.5,
            totalListings: 3
        }
    },
    // Additional listings would be listed here with their user information
];

// Format enum values for display
const formatEnumValue = (value: string) => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export default function ListingDetails() {
    const params = useLocalSearchParams();
    const { id } = params;

    // Find the listing that matches the ID from the URL params
    const listing = mockListings.find(item => item.id === id);

    // Handle the case when listing is not found
    if (!listing) {
        return (
            <SafeAreaView edges={['top']} className='bg-background-0 flex-1'>
                <View className="px-4 py-4">
                    <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center">
                        <FontAwesome name="arrow-left" size={20} color="#000" />
                        <Text className="ml-2 text-typography-700">Back to listings</Text>
                    </TouchableOpacity>

                    <View className="items-center justify-center py-20">
                        <FontAwesome name="exclamation-circle" size={50} color="rgb(var(--color-outline-400))" />
                        <Text className="text-typography-600 mt-4 text-center">Listing not found</Text>
                        <Text className="text-typography-500 mt-1 text-center">This listing may have been removed or is unavailable</Text>

                        <Button
                            size="md"
                            className="bg-primary-500 mt-6"
                            onPress={() => router.back()}
                        >
                            <Text className="text-white font-bold">Go Back</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // If listing is found, display all the details
    return (
        <SafeAreaView edges={['top']} className='bg-background-0 flex-1'>
            <ScrollView className="flex-1">
                <View className="px-4 py-4">
                    {/* Back button */}
                    <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center">
                        <FontAwesome name="arrow-left" size={20} color="#000" />
                        <Text className="ml-2 text-typography-700">Back to listings</Text>
                    </TouchableOpacity>

                    {/* Product Image */}
                    <Image
                        source={{ uri: listing.imageUrl }}
                        className="h-64 w-full rounded-xl mb-4"
                        resizeMode="cover"
                    />

                    {/* Title and Price */}
                    <View className="mb-4">
                        <Heading size="xl" className="text-typography-900">{listing.title}</Heading>
                        <View className="flex-row items-center justify-between mt-2">
                            <Text className="text-primary-600 text-2xl font-bold">${listing.price}</Text>
                            {listing.isRentable && (
                                <View className="bg-primary-100 rounded-full px-3 py-1">
                                    <Text className="text-primary-700">Rent: ${listing.rentalPrice}/day</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Product Details */}
                    <View className="bg-background-50 p-4 rounded-xl mb-4">
                        <View className="flex-row items-center mb-2">
                            <View className="bg-background-100 rounded-full px-3 py-1 mr-2">
                                <Text className="text-typography-700">{formatEnumValue(listing.condition)}</Text>
                            </View>
                            <View className="bg-background-100 rounded-full px-3 py-1">
                                <Text className="text-typography-700">{formatEnumValue(listing.category)}</Text>
                            </View>
                        </View>

                        <View className="mb-2">
                            <Text className="text-typography-500 mb-1">Location</Text>
                            <Text className="text-typography-900">{listing.location}</Text>
                        </View>

                        <View className="mb-2">
                            <Text className="text-typography-500 mb-1">Posted on</Text>
                            <Text className="text-typography-900">{listing.datePosted}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <Text className="text-typography-700 font-bold mb-2">Description</Text>
                        <Text className="text-typography-600">{listing.description}</Text>
                    </View>

                    {/* Seller Information */}
                    <View className="bg-background-50 p-4 rounded-xl mb-6">
                        <Text className="text-typography-700 font-bold mb-3">Seller Information</Text>
                        <View className="flex-row items-center mb-3">
                            {listing.user.avatarUrl ? (
                                <Image
                                    source={{ uri: listing.user.avatarUrl }}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                            ) : (
                                <View className="w-12 h-12 rounded-full bg-background-200 mr-4 items-center justify-center">
                                    <Ionicons name="person" size={24} color="#666" />
                                </View>
                            )}
                            <View>
                                <Text className="text-typography-900 font-bold">{listing.user.name}</Text>
                                <Text className="text-typography-500">Member since {listing.user.joinDate}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center">
                                <FontAwesome name="star" size={16} color="rgb(var(--color-warning-500))" />
                                <Text className="text-typography-700 ml-1">{listing.user.rating} Rating</Text>
                            </View>
                            <Text className="text-typography-600">{listing.user.totalListings} Listings</Text>
                        </View>
                    </View>

                    {/* Contact buttons */}
                    <View className="flex-row mb-8">
                        <Button
                            size="lg"
                            className="bg-primary-500 flex-1 mr-2"
                            onPress={() => Linking.openURL(`mailto:${listing.user.email}`)}
                        >
                            <Text className="text-white font-bold">Email Seller</Text>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary-500 flex-1"
                            onPress={() => {/* Would implement messaging functionality */ }}
                        >
                            <Text className="text-primary-500 font-bold">Chat</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
