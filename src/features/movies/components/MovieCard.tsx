import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Movie } from '../api';
import { theme } from '../../../theme';

interface Props {
  movie: Movie;
  onPress: () => void;
}

export function MovieCard({ movie, onPress }: Props) {
  // TMDB image base URL for backdrop
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.md,
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
    height: 100,
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.surface,
    fontFamily: theme.typography.medium,
    fontSize: 18,
    marginBottom: 4,
  }
});
