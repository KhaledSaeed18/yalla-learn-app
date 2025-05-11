import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from "./text";
import { Box } from "./box";

interface BrowserMockupProps {
    imageUrl: string;
    height?: number;
    className?: string;
}

export const BrowserMockup = ({ imageUrl, height = 250, className = '' }: BrowserMockupProps) => {
    return (
        <View style={[styles.container, { height }]} className={`overflow-hidden rounded-lg ${className}`}>
            {/* Browser Top Bar */}
            <View style={styles.browserBar}>
                <View style={styles.controls}>
                    <View style={[styles.dot, styles.dotRed]} />
                    <View style={[styles.dot, styles.dotYellow]} />
                    <View style={[styles.dot, styles.dotGreen]} />
                </View>
                <View style={styles.addressBar}>
                    <Text className="text-xs text-gray-500 truncate flex-row items-center">
                        <Text className="text-green-600">https://</Text>yallalearn.edu
                    </Text>
                </View>
                <View style={styles.menuButton}>
                    <Box className="w-3.5 h-3.5">
                        <Image
                            source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-hamburger-menu-462145.png?f=webp' }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </Box>
                </View>
            </View>

            {/* Browser Content */}
            <View style={styles.browserContent}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            {/* Browser Shadow Overlay */}
            <View style={styles.innerShadow} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    browserBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    controls: {
        flexDirection: 'row',
        marginRight: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    dotRed: {
        backgroundColor: '#ef4444',
    },
    dotYellow: {
        backgroundColor: '#f59e0b',
    },
    dotGreen: {
        backgroundColor: '#10b981',
    },
    addressBar: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    menuButton: {
        marginLeft: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    browserContent: {
        flex: 1,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    innerShadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        pointerEvents: 'none',
    }
});
