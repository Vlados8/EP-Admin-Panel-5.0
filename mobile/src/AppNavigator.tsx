import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { 
  Home, 
  FileText, 
  CheckSquare as SquareCheck, 
  Briefcase, 
  Mail 
} from 'lucide-react-native';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import NotesScreen from './screens/NotesScreen';
import TasksScreen from './screens/TasksScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import EmailScreen from './screens/EmailScreen';
import { useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') return <Home size={size} color={color} />;
          if (route.name === 'Notizen') return <FileText size={size} color={color} />;
          if (route.name === 'Aufgaben') return <SquareCheck size={size} color={color} />;
          if (route.name === 'Projekte') return <Briefcase size={size} color={color} />;
          if (route.name === 'E-Mail') return <Mail size={size} color={color} />;
          return null;
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Notizen" component={NotesScreen} />
      <Tab.Screen name="Aufgaben" component={TasksScreen} />
      <Tab.Screen name="Projekte" component={ProjectsScreen} />
      <Tab.Screen name="E-Mail" component={EmailScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading && !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
