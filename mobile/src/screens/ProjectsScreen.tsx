import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function ProjectsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 p-6 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Projekte</Text>
                <Text className="text-gray-400 text-center px-4">
                    Hier werden alle Bauprojekte и их стадии.
                </Text>
            </View>
        </SafeAreaView>
    );
}
