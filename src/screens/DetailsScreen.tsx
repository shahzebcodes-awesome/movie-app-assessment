import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useMovieDetails, useMovieVideos } from '../features/movies/api/details';
import { TrailerPlayer } from '../features/movies/components/TrailerPlayer';

type DetailsRouteProp = {
  params: { movieId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Vibrant colors for genre pills from Figma
const GENRE_COLORS = ['#15D2BC', '#E26CA5', '#564CA3', '#CD9D0F'];

export function DetailsScreen() {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { movieId } = route.params;

  const [trailerVisible, setTrailerVisible] = useState(false);

  const { data: movie, isLoading: loadingDetails, isError: errorDetails } = useMovieDetails(movieId);
  const { data: videos } = useMovieVideos(movieId);

  // Find the first YouTube trailer
  const trailerVideo = videos?.find(
    (v) => v.site.toLowerCase() === 'youtube' && v.type.toLowerCase() === 'trailer'
  );

  const handleWatchTrailer = () => {
    if (trailerVideo) {
      setTrailerVisible(true);
    } else {
      alert("No official trailer found for this movie.");
    }
  };

  const handleGetTickets = () => {
    navigation.navigate('SeatMapping', { movieId });
  };

  if (loadingDetails) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00C4FF" />
      </View>
    );
  }

  if (errorDetails || !movie) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load movie details.</Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#00C4FF' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const imagePath = movie.backdrop_path || movie.poster_path;
  const backdropUrl = imagePath 
    ? (imagePath.startsWith('http') ? imagePath : `https://image.tmdb.org/t/p/w500${imagePath}`)
    : 'https://via.placeholder.com/500x300?text=No+Backdrop';

  // Format date: "In Theaters December 22, 2021"
  const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdrop} resizeMode="cover" />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)', '#000']}
            locations={[0, 0.2, 0.7, 1]}
            style={styles.gradient}
          />

          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
            <Text style={styles.backText}>Watch</Text>
          </Pressable>

          <View style={styles.heroContent}>
            <Text style={styles.movieTitle} numberOfLines={2} adjustsFontSizeToFit>{movie.title}</Text>
            <Text style={styles.releaseDate}>In Theaters {formattedDate}</Text>
            
            <Pressable style={styles.ticketsButton} onPress={handleGetTickets}>
              <Text style={styles.ticketsButtonText}>Get Tickets</Text>
            </Pressable>

            <Pressable style={styles.trailerButton} onPress={handleWatchTrailer}>
              <Ionicons name="play" size={16} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.trailerButtonText}>Watch Trailer</Text>
            </Pressable>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.genresContainer}>
            {movie.genres?.map((genre, index) => (
              <View 
                key={genre.id} 
                style={[
                  styles.genrePill, 
                  { backgroundColor: GENRE_COLORS[index % GENRE_COLORS.length] }
                ]}
              >
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overviewText}>{movie.overview}</Text>
        </View>
      </ScrollView>

      {trailerVideo && (
        <TrailerPlayer 
          videoId={trailerVideo.key} 
          visible={trailerVisible} 
          onClose={() => setTrailerVisible(false)} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: SCREEN_HEIGHT * 0.6,
    width: '100%',
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: {
    color: '#FFF',
    fontFamily: theme.typography.medium,
    fontSize: 18,
    marginLeft: 4,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  movieTitle: {
    color: '#FFF',
    fontFamily: theme.typography.medium,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  releaseDate: {
    color: '#FFF',
    fontFamily: theme.typography.regular,
    fontSize: 14,
    marginBottom: 24,
  },
  ticketsButton: {
    backgroundColor: '#00C4FF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketsButtonText: {
    color: '#FFF',
    fontFamily: theme.typography.bold,
    fontSize: 14,
  },
  trailerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00C4FF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailerButtonText: {
    color: '#FFF',
    fontFamily: theme.typography.medium,
    fontSize: 14,
  },
  contentSection: {
    padding: 30,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: '#202C43',
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#FFF',
    fontFamily: theme.typography.medium,
    fontSize: 12,
  },
  overviewText: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: '#8F8F8F',
    lineHeight: 22,
  },
  errorText: {
    fontFamily: theme.typography.regular,
    color: theme.colors.error,
  }
});
