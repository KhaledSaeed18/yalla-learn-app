import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from '@/components/ui/actionsheet';
import { FontAwesome } from '@expo/vector-icons';
import { GigCategory, ServiceDirection } from '@/types/enums';

export interface ServiceFilterOptions {
    category?: string;
    direction?: string;
    sortBy?: string;
    sortOrder?: string;
}

interface ServiceFilterProps {
    onFilterChange: (filters: ServiceFilterOptions) => void;
    initialFilters?: ServiceFilterOptions;
}

export const ServiceFilter = ({ onFilterChange, initialFilters = {} }: ServiceFilterProps) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<ServiceFilterOptions>(initialFilters);
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [filterType, setFilterType] = useState<'category' | 'direction' | 'sort'>('category');

    useEffect(() => {
        updateFilterCount(filters);
    }, [filters]);

    // Format enum values for display
    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleOpenFilter = (type: 'category' | 'direction' | 'sort') => {
        setFilterType(type);
        setFilterOpen(true);
    };

    const handleSelectFilter = (value: string | null) => {
        const newFilters = { ...filters };

        switch (filterType) {
            case 'category':
                if (value === null) {
                    delete newFilters.category;
                } else {
                    newFilters.category = value;
                }
                break;
            case 'direction':
                if (value === null) {
                    delete newFilters.direction;
                } else {
                    newFilters.direction = value;
                }
                break;
            case 'sort':
                if (value === null) {
                    delete newFilters.sortBy;
                    delete newFilters.sortOrder;
                } else {
                    // The value contains both sortBy and sortOrder separated by a colon
                    const [sortBy, sortOrder] = value.split(':');
                    newFilters.sortBy = sortBy;
                    newFilters.sortOrder = sortOrder as 'asc' | 'desc';
                }
                break;
        }

        setFilters(newFilters);
        onFilterChange(newFilters);
        setFilterOpen(false);
    };

    const updateFilterCount = (filters: ServiceFilterOptions) => {
        let count = 0;
        if (filters.category) count++;
        if (filters.direction) count++;
        if (filters.sortBy) count++;
        setActiveFilterCount(count);
    };

    const resetFilters = () => {
        const newFilters = {};
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const renderFilterActionsheet = () => {
        switch (filterType) {
            case 'category':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText>All Categories</ActionsheetItemText>
                        </ActionsheetItem>
                        {Object.values(GigCategory).map((category) => (
                            <ActionsheetItem
                                key={category}
                                onPress={() => handleSelectFilter(category)}
                            >
                                <ActionsheetItemText>{formatEnumValue(category)}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </>
                );
            case 'direction':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText>All Directions</ActionsheetItemText>
                        </ActionsheetItem>
                        {Object.values(ServiceDirection).map((direction) => (
                            <ActionsheetItem
                                key={direction}
                                onPress={() => handleSelectFilter(direction)}
                            >
                                <ActionsheetItemText>{formatEnumValue(direction)}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </>
                );
            case 'sort':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText>Default Sort</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('createdAt:desc')}>
                            <ActionsheetItemText>Newest First</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('createdAt:asc')}>
                            <ActionsheetItemText>Oldest First</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('price:asc')}>
                            <ActionsheetItemText>Price: Low to High</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('price:desc')}>
                            <ActionsheetItemText>Price: High to Low</ActionsheetItemText>
                        </ActionsheetItem>
                    </>
                );
        }
    };

    return (
        <View className="mb-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                    <TouchableOpacity
                        onPress={() => handleOpenFilter('category')}
                        className={`flex-row items-center px-3 py-2 mr-2 rounded-full ${filters.category ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                        <Text className={`${filters.category ? 'text-white' : 'text-gray-700'}`}>
                            {filters.category ? formatEnumValue(filters.category) : 'Category'}
                        </Text>
                        <FontAwesome name="chevron-down" size={12} color={filters.category ? "white" : "#374151"} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleOpenFilter('direction')}
                        className={`flex-row items-center px-3 py-2 mr-2 rounded-full ${filters.direction ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                        <Text className={`${filters.direction ? 'text-white' : 'text-gray-700'}`}>
                            {filters.direction ? formatEnumValue(filters.direction) : 'Direction'}
                        </Text>
                        <FontAwesome name="chevron-down" size={12} color={filters.direction ? "white" : "#374151"} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleOpenFilter('sort')}
                        className={`flex-row items-center px-3 py-2 mr-2 rounded-full ${filters.sortBy ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                        <Text className={`${filters.sortBy ? 'text-white' : 'text-gray-700'}`}>
                            {filters.sortBy ? 'Sort: ' + formatEnumValue(filters.sortBy) : 'Sort'}
                        </Text>
                        <FontAwesome name="chevron-down" size={12} color={filters.sortBy ? "white" : "#374151"} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                    {activeFilterCount > 0 && (
                        <TouchableOpacity
                            onPress={resetFilters}
                            className="flex-row items-center px-3 py-2 mr-2 rounded-full bg-red-100"
                        >
                            <Text className="text-red-700">Clear All</Text>
                            <FontAwesome name="times" size={12} color="#B91C1C" style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <Actionsheet isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <View className="p-2">
                        <Text className="text-lg font-semibold mb-4 px-3">
                            {filterType === 'category' ? 'Select Category' :
                                filterType === 'direction' ? 'Select Direction' : 'Sort By'}
                        </Text>
                        {renderFilterActionsheet()}
                    </View>
                </ActionsheetContent>
            </Actionsheet>
        </View>
    );
};