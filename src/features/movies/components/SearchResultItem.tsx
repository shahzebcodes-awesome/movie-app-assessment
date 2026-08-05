import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../api';
import { theme } from '../../../theme';

interface Props {
  movie: Movie;
  onPress: () => void;
}

const TMDB_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

export function SearchResultItem({ movie, onPress }: Props) {
  // Use backdrop if available, otherwise poster
  const imagePath = movie.backdrop_path || movie.poster_path;
  const imageUrl = imagePath 
    ? (imagePath.startsWith('http') ? imagePath : `https://image.tmdb.org/t/p/w500${imagePath}`)
    : 'https://via.placeholder.com/130x100?text=No+Image';

  const genreName = movie.genre_ids && movie.genre_ids.length > 0 
    ? TMDB_GENRES[movie.genre_ids[0]] || 'Movie'
    : 'Movie';

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
        <Text style={styles.genre} numberOfLines={1}>{genreName}</Text>
      </View>

      <Ionicons name="ellipsis-horizontal" size={24} color="#61C3F2" style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  image: {
    width: 130,
    height: 100,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.border,
  },
  contentContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: '#202C43', // Dark text from Figma
    marginBottom: 4,
  },
  genre: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: '#DBDBDF', // Light gray genre text from Figma
  },
  icon: {
    marginLeft: theme.spacing.md,
  }
});
