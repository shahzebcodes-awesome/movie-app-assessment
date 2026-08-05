import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, Platform, StyleSheet } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { queryClient } from './src/api/queryClient';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';

import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null; // Wait for fonts to load before rendering
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <View style={styles.webContainer}>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" />
              <RootNavigator />
            </NavigationContainer>
          </View>
        </ErrorBoundary>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#000', // Gives a nice dark background outside the "phone" screen on web
    ...Platform.select({
      web: {
        maxWidth: 450,
        width: '100%',
        marginHorizontal: 'auto',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#333',
      }
    })
  }
});
