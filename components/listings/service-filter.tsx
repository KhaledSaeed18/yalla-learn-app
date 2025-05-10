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
                    const [sortBy, sortOrder] = value.split('-');
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

    const clearFilters = () => {
        setFilters({});
        setActiveFilterCount(0);
        onFilterChange({});
    };

    const getFilterIcon = (type: 'category' | 'direction' | 'sort') => {
        switch (type) {
            case 'category':
                return 'th-large';
            case 'direction':
                return 'exchange';
            case 'sort':
                return 'sort';
        }
    };

    const getFilterLabel = (type: 'category' | 'direction' | 'sort') => {
        switch (type) {
            case 'category':
                return filters.category ? formatEnumValue(filters.category) : 'Category';
            case 'direction':
                return filters.direction ? formatEnumValue(filters.direction) : 'Direction';
            case 'sort':
                if (!filters.sortBy) return 'Sort By';
                const sortLabel = filters.sortBy === 'createdAt' ? 'Date' :
                    filters.sortBy === 'price' ? 'Price' : 'Title';
                const orderLabel = filters.sortOrder === 'asc' ? '▲' : '▼';
                return `${sortLabel} ${orderLabel}`;
        }
    };

    const renderFilterActionsheet = () => {
        switch (filterType) {
            case 'category':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={!filters.category ? "font-bold text-primary-600" : ""}>All Categories</ActionsheetItemText>
                        </ActionsheetItem>
                        {Object.values(GigCategory).map((category) => (
                            <ActionsheetItem
                                key={category}
                                onPress={() => handleSelectFilter(category)}
                            >
                                <ActionsheetItemText className={filters.category === category ? "font-bold text-primary-600" : ""}>{formatEnumValue(category)}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </>
                );
            case 'direction':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={!filters.direction ? "font-bold text-primary-600" : ""}>All Directions</ActionsheetItemText>
                        </ActionsheetItem>
                        {Object.values(ServiceDirection).map((direction) => (
                            <ActionsheetItem
                                key={direction}
                                onPress={() => handleSelectFilter(direction)}
                            >
                                <ActionsheetItemText className={filters.direction === direction ? "font-bold text-primary-600" : ""}>{formatEnumValue(direction)}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </>
                );
            case 'sort':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={!filters.sortBy ? "font-bold text-primary-600" : ""}>Default Sort</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('createdAt-desc')}>
                            <ActionsheetItemText className={filters.sortBy === 'createdAt' && filters.sortOrder === 'desc' ? "font-bold text-primary-600" : ""}>Newest First</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('createdAt-asc')}>
                            <ActionsheetItemText className={filters.sortBy === 'createdAt' && filters.sortOrder === 'asc' ? "font-bold text-primary-600" : ""}>Oldest First</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('price-asc')}>
                            <ActionsheetItemText className={filters.sortBy === 'price' && filters.sortOrder === 'asc' ? "font-bold text-primary-600" : ""}>Price: Low to High</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('price-desc')}>
                            <ActionsheetItemText className={filters.sortBy === 'price' && filters.sortOrder === 'desc' ? "font-bold text-primary-600" : ""}>Price: High to Low</ActionsheetItemText>
                        </ActionsheetItem>
                    </>
                );
        }
    };

    return (
        <View className="mb-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4 }}
                className="pb-2"
            >
                <View className="flex-row items-center">
                    {activeFilterCount > 0 && (
                        <TouchableOpacity
                            onPress={clearFilters}
                            className="flex-row items-center px-4 py-2.5 rounded-full bg-red-50 border border-red-100 mr-3"
                        >
                            <FontAwesome name="times" size={12} color="#EF4444" />
                            <Text className="ml-2 text-red-500 font-medium text-xs">Clear Filters</Text>
                        </TouchableOpacity>
                    )}
                    {['category', 'direction', 'sort'].map((type) => {
                        const isActive = type === 'category' ? !!filters.category :
                            type === 'direction' ? !!filters.direction :
                                type === 'sort' ? !!filters.sortBy : false;

                        return (
                            <TouchableOpacity
                                key={type}
                                onPress={() => handleOpenFilter(type as any)}
                                className={`flex-row items-center mr-3 px-4 py-2.5 rounded-full shadow-sm ${isActive
                                    ? 'bg-[#3B82F6] border border-[#3B82F6]/20'
                                    : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <FontAwesome
                                    name={getFilterIcon(type as any)}
                                    size={12}
                                    color={
                                        isActive
                                            ? '#ffffff'
                                            : '#666'
                                    }
                                />
                                <Text
                                    className={`ml-2 text-xs ${isActive
                                        ? 'text-white font-medium'
                                        : 'text-gray-700'
                                        }`}
                                >
                                    {getFilterLabel(type as any)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Filter selection actionsheet */}
            <Actionsheet isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent className="rounded-t-3xl">
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <View className="py-2 px-4 mb-2">
                        <Text className="text-center font-semibold text-lg">
                            {filterType === 'category' ? 'Select Category' :
                                filterType === 'direction' ? 'Select Direction' : 'Sort By'}
                        </Text>
                    </View>
                    {renderFilterActionsheet()}
                </ActionsheetContent>
            </Actionsheet>
        </View>
    );
};