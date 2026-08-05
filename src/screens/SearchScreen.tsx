import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, FlatList, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { GenreGrid } from '../features/movies/components/GenreGrid';
import { SearchResultItem } from '../features/movies/components/SearchResultItem';
import { Skeleton } from '../components/Skeleton';
import { useSearchMovies } from '../features/movies/api/search';
import { useDebounce } from '../hooks/useDebounce';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchInput, setSearchInput] = useState('');
  const debouncedQuery = useDebounce(searchInput, 500);

  const { data: searchResults, isLoading, isError } = useSearchMovies(debouncedQuery);

  const clearSearch = () => {
    setSearchInput('');
  };

  const renderContent = () => {
    if (!debouncedQuery) {
      return <GenreGrid />;
    }

    if (isLoading) {
      return (
        <View style={[styles.centered, { paddingHorizontal: 20 }]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ flexDirection: 'row', width: '100%', marginBottom: 16 }}>
              <Skeleton width={130} height={100} borderRadius={10} />
              <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center' }}>
                <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={16} />
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load search results.</Text>
        </View>
      );
    }

    if (searchResults?.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No movies found.</Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.topResultsHeader}>
          <Text style={styles.topResultsText}>Top Results</Text>
          <View style={styles.separator} />
        </View>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SearchResultItem 
              movie={item} 
              onPress={() => navigation.navigate('Details', { movieId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Senior 60fps optimizations
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => (
            { length: 116, offset: 116 * index, index } // 100 height + 16 marginBottom
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.text} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="TV shows, movies and more"
            placeholderTextColor={theme.colors.tabBarInactive}
            value={searchInput}
            onChangeText={setSearchInput}
            autoFocus
          />
          {searchInput.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={20} color={theme.colors.text} />
            </Pressable>
          )}
        </View>
      </View>
      
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F6',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 30,
    paddingHorizontal: theme.spacing.md,
    height: 52,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.text,
    height: '100%',
    paddingVertical: 0,
    outlineStyle: 'none', // For web to prevent default focus ring
  },
  clearButton: {
    padding: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: theme.spacing.md,
    paddingBottom: 100, // Space for bottom tab bar
  },
  errorText: {
    fontFamily: theme.typography.regular,
    color: theme.colors.error,
  },
  emptyText: {
    fontFamily: theme.typography.regular,
    color: theme.colors.tabBarInactive,
  },
  resultsContainer: {
    flex: 1,
  },
  topResultsHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  topResultsText: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: '#202C43',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  }
});
