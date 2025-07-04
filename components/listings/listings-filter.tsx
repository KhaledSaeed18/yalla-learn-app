import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from '@/components/ui/actionsheet';
import { FontAwesome } from '@expo/vector-icons';
import { Condition, ListingCategory } from '@/types/enums';

export interface FilterOptions {
    category?: string;
    condition?: string;
    isRentable?: boolean;
    direction?: string;
    sortBy?: string;
    sortOrder?: string;
}

interface ListingsFilterProps {
    onFilterChange: (filters: FilterOptions) => void;
    initialFilters?: FilterOptions;
}

export const ListingsFilter = ({ onFilterChange, initialFilters = { sortBy: 'createdAt', sortOrder: 'desc' } }: ListingsFilterProps) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>(initialFilters);
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [filterType, setFilterType] = useState<'category' | 'condition' | 'rentable' | 'sort'>('category');

    useEffect(() => {
        updateFilterCount(filters);
        onFilterChange(filters);
    }, []);

    const formatEnumValue = (value: string) => {
        return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleOpenFilter = (type: 'category' | 'condition' | 'rentable' | 'sort') => {
        setFilterType(type);
        setFilterOpen(true);
    };

    const handleSelectFilter = (value: string | boolean | null) => {
        const newFilters = { ...filters };

        switch (filterType) {
            case 'category':
                if (value === null) {
                    delete newFilters.category;
                } else {
                    newFilters.category = value as string;
                }
                break;
            case 'condition':
                if (value === null) {
                    delete newFilters.condition;
                } else {
                    newFilters.condition = value as string;
                }
                break;
            case 'rentable':
                if (value === null) {
                    delete newFilters.isRentable;
                } else {
                    newFilters.isRentable = value as boolean;
                }
                break;
            case 'sort':
                if (value === null) {
                    delete newFilters.sortBy;
                    delete newFilters.sortOrder;
                } else {
                    const [sortBy, sortOrder] = (value as string).split('-');
                    newFilters.sortBy = sortBy;
                    newFilters.sortOrder = sortOrder;
                }
                break;
        }

        setFilters(newFilters);
        updateFilterCount(newFilters);
        setFilterOpen(false);
        onFilterChange(newFilters);
    };

    const updateFilterCount = (filters: FilterOptions) => {
        let count = 0;
        if (filters.category) count++;
        if (filters.condition) count++;
        if (filters.isRentable !== undefined) count++;
        if (filters.sortBy) count++;
        setActiveFilterCount(count);
    };

    const clearFilters = () => {
        const emptyFilters = {};
        setFilters(emptyFilters);
        setActiveFilterCount(0);
        onFilterChange(emptyFilters);
    };

    const getFilterIcon = (type: 'category' | 'condition' | 'rentable' | 'sort') => {
        switch (type) {
            case 'category':
                return 'th-large';
            case 'condition':
                return 'star';
            case 'rentable':
                return 'clock-o';
            case 'sort':
                return 'sort';
        }
    };

    const getFilterLabel = (type: 'category' | 'condition' | 'rentable' | 'sort') => {
        switch (type) {
            case 'category':
                return filters.category ? formatEnumValue(filters.category) : 'Category';
            case 'condition':
                return filters.condition ? formatEnumValue(filters.condition) : 'Condition';
            case 'rentable':
                return filters.isRentable !== undefined ? (filters.isRentable ? 'Rentable' : 'Not Rentable') : 'Rental Status';
            case 'sort':
                if (!filters.sortBy) return 'Sort By';
                const sortLabel = filters.sortBy === 'createdAt' ? 'Date' :
                    filters.sortBy === 'price' ? 'Price' :
                        filters.sortBy === 'title' ? 'Title' : 'Date';
                const orderLabel = filters.sortOrder === 'asc' ? '▲' : '▼';
                return `${sortLabel} ${orderLabel}`;
        }
    };

    const renderFilterContent = () => {
        switch (filterType) {
            case 'category':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={!filters.category ? "font-bold text-primary-600" : ""}>All Categories</ActionsheetItemText>
                        </ActionsheetItem>
                        {Object.values(ListingCategory).map((category) => (
                            <ActionsheetItem key={category} onPress={() => handleSelectFilter(category)}>
                                <ActionsheetItemText className={filters.category === category ? "font-bold text-primary-600" : ""}>
                                    {formatEnumValue(category)}
                                </ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </>
                );
            case 'condition':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={!filters.condition ? "font-bold text-primary-600" : ""}>Any Condition</ActionsheetItemText>
                        </ActionsheetItem>
                        {Object.values(Condition).map((condition) => (
                            <ActionsheetItem key={condition} onPress={() => handleSelectFilter(condition)}>
                                <ActionsheetItemText className={filters.condition === condition ? "font-bold text-primary-600" : ""}>
                                    {formatEnumValue(condition)}
                                </ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                    </>
                );
            case 'rentable':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={filters.isRentable === undefined ? "font-bold text-primary-600" : ""}>Any Status</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter(true)}>
                            <ActionsheetItemText className={filters.isRentable === true ? "font-bold text-primary-600" : ""}>Rentable Only</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter(false)}>
                            <ActionsheetItemText className={filters.isRentable === false ? "font-bold text-primary-600" : ""}>Not Rentable</ActionsheetItemText>
                        </ActionsheetItem>
                    </>
                );
            case 'sort':
                return (
                    <>
                        <ActionsheetItem onPress={() => handleSelectFilter(null)}>
                            <ActionsheetItemText className={!filters.sortBy ? "font-bold text-primary-600" : ""}>No Sort</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('createdAt-desc')}>
                            <ActionsheetItemText className={filters.sortBy === 'createdAt' && filters.sortOrder === 'desc' ? "font-bold text-primary-600" : ""}>
                                Newest First
                            </ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('createdAt-asc')}>
                            <ActionsheetItemText className={filters.sortBy === 'createdAt' && filters.sortOrder === 'asc' ? "font-bold text-primary-600" : ""}>
                                Oldest First
                            </ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('price-asc')}>
                            <ActionsheetItemText className={filters.sortBy === 'price' && filters.sortOrder === 'asc' ? "font-bold text-primary-600" : ""}>
                                Price: Low to High
                            </ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('price-desc')}>
                            <ActionsheetItemText className={filters.sortBy === 'price' && filters.sortOrder === 'desc' ? "font-bold text-primary-600" : ""}>
                                Price: High to Low
                            </ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('title-asc')}>
                            <ActionsheetItemText className={filters.sortBy === 'title' && filters.sortOrder === 'asc' ? "font-bold text-primary-600" : ""}>
                                Title: A to Z
                            </ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => handleSelectFilter('title-desc')}>
                            <ActionsheetItemText className={filters.sortBy === 'title' && filters.sortOrder === 'desc' ? "font-bold text-primary-600" : ""}>
                                Title: Z to A
                            </ActionsheetItemText>
                        </ActionsheetItem>
                    </>
                );
        }
    };

    return (
        <View className="">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4 }}
                className=""
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
                    {['category', 'condition', 'rentable', 'sort'].map((type) => {
                        const isActive = type === 'category' ? !!filters.category :
                            type === 'condition' ? !!filters.condition :
                                type === 'rentable' ? filters.isRentable !== undefined :
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
                                filterType === 'condition' ? 'Select Condition' :
                                    filterType === 'rentable' ? 'Rental Status' : 'Sort By'}
                        </Text>
                    </View>
                    {renderFilterContent()}
                </ActionsheetContent>
            </Actionsheet>
        </View>
    );
};
