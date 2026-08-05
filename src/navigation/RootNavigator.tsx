import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardIcon, WatchIcon, MediaLibraryIcon } from '../components/Icons';

import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { SeatMappingScreen } from '../screens/SeatMappingScreen';
import { SeatSelectionScreen } from '../screens/SeatSelectionScreen';
import { RootStackParamList } from './types';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Dashboard') {
            return <DashboardIcon size={size} color={color} />;
          } else if (route.name === 'Watch') {
            return <WatchIcon size={size} color={color} />;
          } else if (route.name === 'Media Library') {
            return <MediaLibraryIcon size={size} color={color} />;
          } else if (route.name === 'More') {
            return <Ionicons name="list" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
          borderTopWidth: 0, 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24,
          paddingBottom: 8,
          paddingTop: 8,
          height: 75,
          position: 'absolute', // Floating effect over the list
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.regular,
          fontSize: 10,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0, 
          shadowOpacity: 0, 
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTitleStyle: {
          fontFamily: theme.typography.medium,
          fontSize: 20,
          color: theme.colors.text,
        },
        headerTitleAlign: 'left',
      })}
    >
      <Tab.Screen name="Dashboard" component={PlaceholderScreen} />
      <Tab.Screen 
        name="Watch" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          headerRight: () => (
            <Ionicons 
              name="search" 
              size={24} 
              color={theme.colors.text} 
              style={{ marginRight: 20 }}
              onPress={() => navigation.navigate('Search')}
            />
          ),
        })}
      />
      <Tab.Screen name="Media Library" component={PlaceholderScreen} />
      <Tab.Screen name="More" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ 
          headerShown: true,
          title: 'Search',
          headerTitleStyle: { fontFamily: theme.typography.medium },
        }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="SeatMapping" component={SeatMappingScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
    </Stack.Navigator>
  );
}
