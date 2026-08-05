import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../theme';

const { width } = Dimensions.get('window');
const isWeb = width > 500;
const containerWidth = isWeb ? 450 : width;
const cardWidth = (containerWidth - theme.spacing.md * 3) / 2; // 2 columns, padding on edges and in middle

interface Genre {
  id: string;
  name: string;
  imageUrl: string;
}

const GENRES: Genre[] = [
  { id: '1', name: 'Comedies', imageUrl: 'https://images.unsplash.com/photo-1543584756-8f40a802e14f?w=500&q=80' },
  { id: '2', name: 'Crime', imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&q=80' },
  { id: '3', name: 'Family', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80' },
  { id: '4', name: 'Documentaries', imageUrl: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=500&q=80' },
  { id: '5', name: 'Dramas', imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80' },
  { id: '6', name: 'Fantasy', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80' },
  { id: '7', name: 'Holidays', imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=500&q=80' },
  { id: '8', name: 'Horror', imageUrl: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&q=80' },
  { id: '9', name: 'Sci-Fi', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80' },
  { id: '10', name: 'Thriller', imageUrl: 'https://images.unsplash.com/photo-1560930950-5cc20e8cbe14?w=500&q=80' },
];

export function GenreGrid() {
  return (
    <FlatList
      data={GENRES}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <Text style={styles.title}>{item.name}</Text>
          </LinearGradient>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Space for bottom tab bar
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  card: {
    width: cardWidth,
    height: 100,
    borderRadius: theme.radii.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: theme.spacing.sm,
  },
  title: {
    color: theme.colors.surface,
    fontFamily: theme.typography.medium,
    fontSize: 16,
  }
});
