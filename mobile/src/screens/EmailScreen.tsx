import React from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Mail, MailWarning, User } from 'lucide-react-native';

const fetchEmails = async () => {
    const { data } = await apiClient.get('/email/messages');
    return data.data || [];
};

export default function EmailScreen() {
    const { data: emails, isLoading, error } = useQuery({
        queryKey: ['emails'],
        queryFn: fetchEmails,
    });

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator color="#000" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-6">
                <Text className="text-2xl font-bold text-gray-900 mb-6">E-Mail</Text>
                
                {emails.length === 0 ? (
                    <View className="items-center justify-center h-64">
                        <Text className="text-gray-400">Keine E-Mails gefunden.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={emails}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100 flex-row items-center">
                                <View className={`w-10 h-10 rounded-full items-center justify-center ${item.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                    <Mail size={18} color={item.isRead ? '#6B7280' : '#3B82F6'} />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className={`text-sm ${item.isRead ? 'text-gray-500' : 'font-bold text-gray-900'}`} numberOfLines={1}>
                                        {item.subject || '(Kein Betreff)'}
                                    </Text>
                                    <Text className="text-xs text-gray-400 mt-1" numberOfLines={1}>
                                        Von: {item.from_email}
                                    </Text>
                                </View>
                                <Text className="text-[10px] text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString('de-DE')}
                                </Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
