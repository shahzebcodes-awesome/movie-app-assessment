import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUpcomingMovies } from '../features/movies/api';
import { MovieCard } from '../features/movies/components/MovieCard';
import { Skeleton } from '../components/Skeleton';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: movies, isLoading, isError } = useUpcomingMovies();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={180} style={{ marginHorizontal: 20, marginBottom: 20 }} borderRadius={10} />
          ))}
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load movies.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard 
            movie={item} 
            onPress={() => navigation.navigate('Details', { movieId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Senior 60fps optimizations
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => (
          { length: 200, offset: 200 * index, index } // 180 height + 20 marginBottom
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingTop: theme.spacing.md,
    // Add extra padding at the bottom so the last item isn't hidden by the floating tab bar
    paddingBottom: 100, 
  },
  errorText: {
    fontFamily: theme.typography.regular,
    color: theme.colors.error,
  }
});
