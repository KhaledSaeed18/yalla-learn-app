import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet";
import { SearchIcon } from '@/components/ui/icon';
import { ListingCategory, Condition } from '@/types/enums';
import { router } from 'expo-router';

// Mock data for listings
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
        description: 'Excellent condition MacBook Pro with M2 chip, 16GB RAM, 512GB SSD.',
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
        description: 'Calculus: Early Transcendentals by James Stewart, 8th edition. Some highlighting inside.',
    },
    {
        id: '3',
        title: 'Acoustic Guitar',
        price: 250,
        condition: Condition.GOOD,
        category: ListingCategory.MUSICAL_INSTRUMENTS,
        isRentable: true,
        rentalPrice: 25,
        imageUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Yamaha acoustic guitar. Good condition, replaced strings recently.',
    },
    {
        id: '4',
        title: 'Physics Lab Kit',
        price: 120,
        condition: Condition.FAIR,
        category: ListingCategory.COURSE_MATERIALS,
        isRentable: false,
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Physics lab equipment including oscilloscope, multimeter, and various components.',
    },
    {
        id: '5',
        title: 'Winter Coat',
        price: 85,
        condition: Condition.NEW,
        category: ListingCategory.CLOTHING,
        isRentable: false,
        imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Brand new winter coat, size L, waterproof and insulated.',
    },
    {
        id: '6',
        title: 'Basketball',
        price: 30,
        condition: Condition.GOOD,
        category: ListingCategory.SPORTS_EQUIPMENT,
        isRentable: true,
        rentalPrice: 5,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Official size basketball, slightly used but in good condition.',
    },
    {
        id: '7',
        title: 'Drill Set',
        price: 150,
        condition: Condition.FAIR,
        category: ListingCategory.TOOLS,
        isRentable: true,
        rentalPrice: 20,
        imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Complete drill set with various bits and accessories.',
    },
    {
        id: '8',
        title: 'Desk Lamp',
        price: 45,
        condition: Condition.LIKE_NEW,
        category: ListingCategory.OTHER,
        isRentable: false,
        imageUrl: 'https://images.unsplash.com/photo-1534107895776-4f282fb44840?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'Modern LED desk lamp with adjustable brightness levels.',
    },
];

// Format enum values for display
const formatEnumValue = (value: string) => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Calculate the width of each card based on screen width
const { width } = Dimensions.get('window');
const cardWidth = width < 700 ? width / 2 - 16 : width / 3 - 18;

const Listings = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Filter the listings based on search query and selected category
    const filteredListings = useMemo(() => {
        return mockListings.filter(listing => {
            const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === null || listing.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    // Handle category selection
    const handleCategorySelect = (category: string | null) => {
        setSelectedCategory(category);
        setFilterSheetOpen(false);
    };

    // Simulate loading when applying filters
    const applyFilter = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    };

    // Handle listing item press - navigate to the detail page
    const handleListingPress = (itemId: string) => {
        router.push(`/listing-details?id=${itemId}`);
    };

    // Render each item in the grid
    const renderItem = ({ item }: { item: typeof mockListings[0] }) => (
        <TouchableOpacity
            style={{ width: cardWidth, marginBottom: 16 }}
            className="bg-background-50 rounded-xl overflow-hidden shadow-md"
            activeOpacity={0.7}
            onPress={() => handleListingPress(item.id)}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.imageUrl }}
                    className="h-40 w-full"
                    resizeMode="cover"
                />
                {item.isRentable && (
                    <View className="absolute top-2 right-2 bg-primary-500 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-bold">Rentable</Text>
                    </View>
                )}
            </View>

            <View className="p-3">
                <Text numberOfLines={1} className="text-typography-900 font-bold text-base">{item.title}</Text>
                <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-typography-700 font-bold">${item.price}</Text>
                    <View className="bg-background-200 rounded-full px-2 py-0.5">
                        <Text className="text-typography-700 text-xs">{formatEnumValue(item.condition)}</Text>
                    </View>
                </View>

                <View className="mt-2">
                    <Text numberOfLines={1} className="text-typography-600 text-xs">{formatEnumValue(item.category)}</Text>
                    {item.isRentable && (
                        <Text className="text-primary-600 text-xs mt-1">Rent: ${item.rentalPrice}/day</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView edges={['top']} className='bg-background-0 flex-1'>
            <View className="flex-1">
                <View className="px-4 pt-4">
                    <Heading size="xl" className="mb-2 text-typography-900">Marketplace</Heading>

                    {/* Search and Filter Section */}
                    <View className="flex-row items-center mb-4">
                        <View className="flex-1 mr-2">
                            <Input variant="outline" size="md">
                                <InputIcon as={SearchIcon} className="ml-3" />
                                <InputField
                                    placeholder="Search products"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </Input>
                        </View>
                        <TouchableOpacity
                            onPress={() => setFilterSheetOpen(true)}
                            className="bg-background-100 p-3 rounded-md"
                        >
                            <FontAwesome name="sliders" size={20} color="rgb(var(--color-primary-500))" />
                        </TouchableOpacity>
                    </View>

                    {/* Selected Category Display */}
                    {selectedCategory && (
                        <View className="mb-4 flex-row">
                            <View className="bg-primary-100 rounded-full px-3 py-1 flex-row items-center">
                                <Text className="text-primary-700 text-sm">{formatEnumValue(selectedCategory)}</Text>
                                <TouchableOpacity onPress={() => setSelectedCategory(null)} className="ml-2">
                                    <FontAwesome name="times-circle" size={16} color="rgb(var(--color-primary-700))" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Results count */}
                    <Text className="text-typography-600 mb-4">{filteredListings.length} {filteredListings.length === 1 ? 'product' : 'products'} found</Text>
                </View>

                {/* Loading indicator */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color="rgb(var(--color-primary-500))" />
                    </View>
                ) : (
                    <>
                        {/* Products grid */}
                        {filteredListings.length > 0 ? (
                            <FlatList
                                data={filteredListings}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                numColumns={width < 700 ? 2 : 3}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
                                initialNumToRender={6}
                                maxToRenderPerBatch={10}
                                windowSize={10}
                                removeClippedSubviews={true}
                            />
                        ) : (
                            <View className="items-center justify-center py-20 px-4">
                                <FontAwesome name="search" size={50} color="rgb(var(--color-outline-400))" />
                                <Text className="text-typography-600 mt-4 text-center">No products found</Text>
                                <Text className="text-typography-500 mt-1 text-center">Try different search terms or filters</Text>
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Filter Actionsheet */}
            <Actionsheet isOpen={filterSheetOpen} onClose={() => setFilterSheetOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    <View className="px-4 pb-4">
                        <Heading size="md" className="mb-4 text-typography-900">Filter by Category</Heading>

                        <ActionsheetItem
                            onPress={() => handleCategorySelect(null)}
                            className={selectedCategory === null ? "bg-background-100" : ""}
                        >
                            <ActionsheetItemText>All Categories</ActionsheetItemText>
                        </ActionsheetItem>

                        {Object.values(ListingCategory).map((category) => (
                            <ActionsheetItem
                                key={category}
                                onPress={() => handleCategorySelect(category)}
                                className={selectedCategory === category ? "bg-background-100" : ""}
                            >
                                <ActionsheetItemText>{formatEnumValue(category)}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </View>

                    <View className="border-t border-outline-200 p-4">
                        <Button
                            size="lg"
                            className="bg-primary-500"
                            onPress={() => {
                                setFilterSheetOpen(false);
                                applyFilter();
                            }}
                        >
                            <Text className="text-white font-bold">Apply Filters</Text>
                        </Button>
                    </View>
                </ActionsheetContent>
            </Actionsheet>
        </SafeAreaView>
    );
};

export default Listings;