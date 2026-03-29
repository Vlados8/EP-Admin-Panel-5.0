import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  CirclePlus, 
  SquareCheck, 
  Briefcase, 
  Mail, 
  LogOut,
  Bell,
  Settings
} from 'lucide-react-native';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  const QuickAction = ({ icon: Icon, label, onPress, color = "black" }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center justify-center w-[46%] mb-4"
    >
      <View className={`p-3 rounded-2xl mb-3 bg-gray-50`}>
        <Icon size={28} color={color} />
      </View>
      <Text className="text-gray-900 font-bold text-xs text-center uppercase tracking-tighter">
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-10">
          <View>
            <Text className="text-gray-400 text-sm font-medium">Willkommen zurück,</Text>
            <Text className="text-3xl font-bold text-gray-900">
              {user?.firstName || 'User'}
            </Text>
          </View>
          <View className="flex-row gap-x-3">
            <TouchableOpacity className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
              <Bell size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
              <LogOut size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Title */}
        <Text className="text-gray-900 font-bold text-xl mb-6">Schnellzugriff</Text>

        {/* Grid */}
        <View className="flex-row flex-wrap justify-between">
          <QuickAction 
            icon={CirclePlus} 
            label="Neue Notiz" 
            onPress={() => {}} 
            color="#3B82F6"
          />
          <QuickAction 
            icon={SquareCheck} 
            label="Neue Aufgabe" 
            onPress={() => {}} 
            color="#10B981"
          />
          <QuickAction 
            icon={Briefcase} 
            label="Neues Projekt" 
            onPress={() => {}} 
            color="#F59E0B"
          />
          <QuickAction 
            icon={Mail} 
            label="E-Mail schreiben" 
            onPress={() => {}} 
            color="#8B5CF6"
          />
        </View>

        {/* Placeholder for Stats/Recent */}
        <View className="mt-8">
            <Text className="text-gray-900 font-bold text-xl mb-4">Aktivität</Text>
            <View className="bg-white p-6 rounded-3xl border border-gray-100 items-center">
                <Text className="text-gray-400 text-center text-sm">
                    Keine aktuellen Aktivitäten vorhanden.
                </Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
