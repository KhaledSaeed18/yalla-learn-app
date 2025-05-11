import { View, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ListingCard } from '@/components/ui/listing-card';
import { ServiceCard } from '@/components/ui/service-card';
import { FontAwesome as FontAwesomeType } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { ListingResponse } from '@/types/service/product.types';
import { ServiceResponse } from '@/types/service/service.types';
import { productService } from '@/services/product.service';
import { serviceService } from '@/services/service.service';
import { BrainCircuit } from 'lucide-react-native';
import WebsiteCTA from '@/components/ui/browser-mockup';

const HomeHeader = () => (
    <View className="flex-row justify-between items-center pb-4 pt-2 px-4 border-b border-gray-200">
        <View className="flex-row items-center">
            <BrainCircuit size={28} color="#3B82F6" className="mr-2" />
            <Heading size="xl" className="text-primary-600">Yalla Learn</Heading>
        </View>
    </View>
);

interface FeatureCardProps {
    icon: React.ComponentProps<typeof FontAwesomeType>['name'];
    title: string;
    description: string;
    onPress: () => void;
    bgColor: string;
}

const FeatureCard = ({ icon, title, description, onPress, bgColor }: FeatureCardProps) => (
    <TouchableOpacity
        className={`p-4 rounded mr-3 w-[160px] h-[170px] ${bgColor}`}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <View className="flex-1 justify-between">
            <FontAwesome name={icon} size={24} color="#ffffff" />
            <View>
                <Text className="text-white font-bold text-lg mb-1">{title}</Text>
                <Text className="text-white text-xs opacity-80">{description}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default function HomePage() {
    const [listings, setListings] = useState<ListingResponse[]>([]);
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);

    const navigateToAddListings = () => router.push("/(tabs)/add-product");
    const navigateToListings = () => router.push("/(tabs)/listings");
    const navigateToAddServices = () => router.push("/(tabs)/add-service");
    const navigateToServices = () => router.push("/(tabs)/services");
    const navigateToAdd = () => router.push("/(tabs)/add");
    const navigateToWebsite = () => router.push("https://google.com");

    useEffect(() => {
        const fetchRecentListings = async () => {
            try {
                setLoadingListings(true);
                const response = await productService.getListings(1, 2);
                if (response && response.data) {
                    setListings(response.data.listings);
                }
            } catch (error) {
                console.error('Error fetching recent listings:', error);
            } finally {
                setLoadingListings(false);
            }
        };

        fetchRecentListings();
    }, []);

    useEffect(() => {
        const fetchRecentServices = async () => {
            try {
                setLoadingServices(true);
                const serviceFilters = {
                    page: 1,
                    limit: 2,
                    sortBy: 'createdAt',
                    sortOrder: 'desc' as 'desc'
                };
                const response = await serviceService.getServices(serviceFilters);
                if (response && response.data && response.data.services) {
                    setServices(response.data.services);
                }
            } catch (error) {
                console.error('Error fetching recent services:', error);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchRecentServices();
    }, []);

    const handleListingPress = (id: string) => {
        router.push({
            pathname: "/listing/[id]",
            params: { id }
        });
    };

    return (
        <SafeAreaView className="bg-background-0 flex-1">
            <HomeHeader />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000' }}
                    className="h-[200px] justify-center p-4 mb-6"
                    imageStyle={{ opacity: 0.85, backgroundColor: '#3B82F6' }}
                >
                    <View className="bg-black/70 p-4 rounded flex justify-center items-center">
                        <Heading size="xl" className="text-white mb-1">Connect. Learn. Thrive.</Heading>
                        <Text className="text-white text-sm mb-3">Your campus marketplace for knowledge and resources</Text>
                        <Button
                            size="sm"
                            action="primary"
                            onPress={navigateToAdd}
                        >
                            <Text className="text-white font-semibold">Get Started</Text>
                        </Button>
                    </View>
                </ImageBackground>

                {/* Features Section */}
                <View className="px-4 mb-6">
                    <Heading size="lg" className="mb-4">Discover</Heading>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <FeatureCard
                            icon="shopping-cart"
                            title="Buy & Sell"
                            description="Find textbooks, electronics and more"
                            onPress={navigateToAddListings}
                            bgColor="bg-[#3B82F6]"
                        />
                        <FeatureCard
                            icon="handshake-o"
                            title="Services"
                            description="Tutoring, mentoring, skill-sharing"
                            onPress={navigateToAddServices}
                            bgColor="bg-[#10B981]"
                        />
                        <FeatureCard
                            icon="users"
                            title="Connect"
                            description="Join study groups & more"
                            onPress={navigateToWebsite}
                            bgColor="bg-[#8B5CF6]"
                        />
                    </ScrollView>
                </View>

                {/* Website CTA Section */}
                <View className="px-4 mt-2 mb-4">
                    <WebsiteCTA />
                </View>

                {/* Recent Listings Section */}
                <View className="px-4 mb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Heading size="lg">Recent Listings</Heading>
                        <TouchableOpacity onPress={navigateToListings}>
                            <Text className="text-primary-500">View All</Text>
                        </TouchableOpacity>
                    </View>
                    {loadingListings ? (
                        <View className="flex-1 items-center py-6">
                            <ActivityIndicator size="small" color="#3B82F6" />
                            <Text className="mt-2 text-gray-500">Loading listings...</Text>
                        </View>
                    ) : listings.length > 0 ? (
                        listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                onPress={() => handleListingPress(listing.id)}
                            />
                        ))
                    ) : (
                        <View className="py-6 items-center">
                            <Text className="text-gray-500">No listings found</Text>
                        </View>
                    )}
                </View>

                {/* Services Section */}
                <View className="px-4 mb-8">
                    <View className="flex-row justify-between items-center mb-3">
                        <Heading size="lg">Services</Heading>
                        <TouchableOpacity onPress={navigateToServices}>
                            <Text className="text-primary-500">View All</Text>
                        </TouchableOpacity>
                    </View>
                    {loadingServices ? (
                        <View className="flex-1 items-center py-6">
                            <ActivityIndicator size="small" color="#3B82F6" />
                            <Text className="mt-2 text-gray-500">Loading services...</Text>
                        </View>
                    ) : services.length > 0 ? (
                        services.map(service => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onPress={() => router.push({
                                    pathname: "/service/[id]",
                                    params: { id: service.id }
                                })}
                            />
                        ))
                    ) : (
                        <View className="py-6 items-center">
                            <Text className="text-gray-500">No services found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}