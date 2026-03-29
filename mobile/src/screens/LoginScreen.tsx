import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      setErrorMsg('');
      await login(email, password);
    } catch (err: any) {
      console.error('[Login] Error:', err);
      const message = err.response?.data?.message || 'Anmeldung fehlgeschlagen. Netzwerk prüfen.';
      setErrorMsg(message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <View className="flex-1 items-center justify-center p-8">
        <View className="items-center mb-10">
          <Text className="text-3xl font-bold text-gray-900 mt-4">Empire Premium Bau</Text>
          <Text className="text-gray-500 mt-2 text-center text-sm">
            Management Panel
          </Text>
        </View>

        <View className="w-full max-w-sm">
          {errorMsg ? (
            <View className="bg-red-50 p-3 rounded-xl mb-4 border border-red-200">
              <Text className="text-red-600 text-sm text-center">{errorMsg}</Text>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email-Adresse eingeben"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Passwort
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Passwort eingeben"
              secureTextEntry
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`w-full bg-black py-4 rounded-xl flex-row justify-center items-center ${
              isLoading ? 'opacity-70' : ''
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base uppercase tracking-widest">
                Anmelden
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
