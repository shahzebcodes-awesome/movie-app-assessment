import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useMovieDetails } from '../features/movies/api/details';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

type RouteProp = {
  params: { movieId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SeatMapping'>;

const DATES = [
  { id: '1', label: '5 Mar' },
  { id: '2', label: '6 Mar' },
  { id: '3', label: '7 Mar' },
  { id: '4', label: '8 Mar' },
  { id: '5', label: '9 Mar' },
];

const SHOWTIMES = [
  { id: '1', time: '12:30', hall: 'Cinetech + Hall 1', price: '50$', bonus: '2500' },
  { id: '2', time: '13:30', hall: 'Cinetech + Hall 2', price: '75$', bonus: '3000' },
  { id: '3', time: '15:30', hall: 'Cinetech + Hall 1', price: '50$', bonus: '2500' },
];

// A tiny SVG component to mock the seat map preview inside the showtime card
function SeatMapPreview({ selected }: { selected: boolean }) {
  const baseColor = selected ? '#00C4FF' : '#DBDBDF';
  
  return (
    <Svg width="140" height="110" viewBox="0 0 140 110">
      <Rect x="0" y="0" width="140" height="110" fill="transparent" />
      {/* Top curved screen arc */}
      <Path d="M 30 20 Q 70 10 110 20" stroke={baseColor} strokeWidth="1" fill="none" />
      
      {/* Generate a 10-row miniature seat map */}
      {Array.from({ length: 10 }).map((_, rowIndex) => {
        // Create a slight curve by offsetting rows
        const rowWidth = rowIndex < 3 ? 14 : rowIndex < 7 ? 16 : 18;
        const startOffset = (18 - rowWidth) * 3;
        
        return (
          <React.Fragment key={rowIndex}>
            {Array.from({ length: rowWidth }).map((_, colIndex) => {
              // Base X position, add gaps for aisles to create 3 blocks
              let xPos = 15 + startOffset + colIndex * 6;
              if (colIndex >= Math.floor(rowWidth / 3)) xPos += 8; // First aisle
              if (colIndex >= Math.floor((rowWidth * 2) / 3)) xPos += 8; // Second aisle

              // Randomly assign dot colors to mimic availability
              let dotColor = '#DBDBDF'; // default grey (reserved)
              if (selected) {
                const rand = Math.random();
                if (rand > 0.6) dotColor = '#00C4FF'; // Cyan (available)
                if (rowIndex > 4 && rowIndex < 8 && colIndex > 4 && colIndex < 12 && rand > 0.8) {
                   dotColor = '#E26CA5'; // Pink (VIP)
                }
              }

              return (
                <Circle 
                  key={`${rowIndex}-${colIndex}`} 
                  cx={xPos} 
                  cy={30 + rowIndex * 7} 
                  r="1.5" 
                  fill={dotColor} 
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export function SeatMappingScreen() {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { movieId } = route.params;

  const { data: movie, isLoading } = useMovieDetails(movieId);

  const [selectedDate, setSelectedDate] = useState(DATES[0].id);
  const [selectedTime, setSelectedTime] = useState(SHOWTIMES[0].id);

  if (isLoading || !movie) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00C4FF" />
      </View>
    );
  }

  const formattedDate = new Date(movie.release_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSelectSeats = () => {
    const timeObj = SHOWTIMES.find(t => t.id === selectedTime);
    const dateObj = DATES.find(d => d.id === selectedDate);
    navigation.navigate('SeatSelection', { 
      movieId,
      date: dateObj?.label || '',
      time: timeObj?.time || '',
      hall: timeObj?.hall || ''
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#202C43" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.releaseDate}>In Theaters {formattedDate}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <Text style={styles.sectionTitle}>Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {DATES.map((date) => {
            const isSelected = date.id === selectedDate;
            return (
              <Pressable
                key={date.id}
                style={[styles.datePill, isSelected && styles.datePillSelected]}
                onPress={() => setSelectedDate(date.id)}
              >
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                  {date.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Showtime Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.horizontalScroll, { marginTop: 30 }]}>
          {SHOWTIMES.map((showtime) => {
            const isSelected = showtime.id === selectedTime;
            return (
              <Pressable key={showtime.id} style={styles.showtimeCard} onPress={() => setSelectedTime(showtime.id)}>
                <View style={styles.showtimeHeader}>
                  <Text style={styles.timeText}>{showtime.time}</Text>
                  <Text style={styles.hallText}>{showtime.hall}</Text>
                </View>
                <View style={[styles.mapPreviewBox, isSelected && styles.mapPreviewBoxSelected]}>
                  <SeatMapPreview selected={isSelected} />
                </View>
                <Text style={styles.priceText}>
                  From <Text style={styles.priceBold}>{showtime.price}</Text> or <Text style={styles.priceBold}>{showtime.bonus} bonus</Text>
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Pressable style={styles.selectButton} onPress={handleSelectSeats}>
          <Text style={styles.selectButtonText}>Select Seats</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50, // Safe area for notch
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F6',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 39, // offset back button to center text perfectly
  },
  movieTitle: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: '#202C43',
  },
  releaseDate: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: '#00C4FF',
    marginTop: 4,
  },
  scrollContent: {
    paddingVertical: 30,
  },
  sectionTitle: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: '#202C43',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  datePill: {
    backgroundColor: '#F2F2F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  datePillSelected: {
    backgroundColor: '#00C4FF',
  },
  dateText: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: '#202C43',
  },
  dateTextSelected: {
    color: '#FFF',
  },
  showtimeCard: {
    marginRight: 20,
    width: 250,
  },
  showtimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: '#202C43',
    marginRight: 10,
  },
  hallText: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: '#8F8F8F',
  },
  mapPreviewBox: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapPreviewBoxSelected: {
    borderColor: '#00C4FF',
  },
  priceText: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: '#8F8F8F',
  },
  priceBold: {
    fontFamily: theme.typography.medium,
    color: '#202C43',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F6',
  },
  selectButton: {
    backgroundColor: '#00C4FF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: '#FFF',
  }
});
