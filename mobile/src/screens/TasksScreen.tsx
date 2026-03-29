import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function TasksScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 p-6 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Aufgaben</Text>
                <Text className="text-gray-400 text-center px-4">
                    Hier werden alle Aufgaben и Fristen angezeigt. Похоже на Канбан, но для мобильных.
                </Text>
            </View>
        </SafeAreaView>
    );
}
