import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type RouteProp = {
  params: { movieId: number; movieTitle: string; date: string; time: string; hall: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SeatSelection'>;

// Seat Types
type SeatStatus = 'available' | 'reserved' | 'vip';
interface Seat {
  id: string;
  row: number;
  col: number;
  status: SeatStatus;
  price: number;
}

const SEAT_COLORS = {
  selected: '#CD9D0F', // Gold
  reserved: '#EFEFEF', // Light gray
  vip: '#564CA3',      // Purple
  regular: '#00C4FF',  // Cyan
};

// Generate realistic seat map (10 rows)
function generateSeats(): Seat[][] {
  const layout = [];
  const rows = 10;
  for (let r = 1; r <= rows; r++) {
    const cols = r < 4 ? 14 : r < 8 ? 16 : 18; // wider at the back
    const rowSeats: Seat[] = [];
    for (let c = 1; c <= cols; c++) {
      // Randomly assign VIP (purple) to middle seats in back rows
      const isVip = r > 7 && c > 4 && c < cols - 3;
      // Randomly reserve some seats
      const isReserved = Math.random() > 0.8;
      
      rowSeats.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        status: isReserved ? 'reserved' : isVip ? 'vip' : 'available',
        price: isVip ? 150 : 50,
      });
    }
    layout.push(rowSeats);
  }
  return layout;
}

export function SeatSelectionScreen() {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { movieTitle, date, time, hall } = route.params;

  // Use useMemo so we don't regenerate on every render
  const seatLayout = useMemo(() => generateSeats(), []);
  
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'reserved') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Curved screen SVG at the top
  const ScreenCurve = () => (
    <View style={styles.screenCurveContainer}>
      <Svg width="100%" height="40" viewBox="0 0 400 40">
        <Path d="M 20 30 Q 200 -10 380 30" stroke="#00C4FF" strokeWidth="2" fill="none" opacity={0.3} />
      </Svg>
      <Text style={styles.screenText}>SCREEN</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#202C43" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.movieTitle}>{movieTitle}</Text>
          <Text style={styles.subtitle}>{date} | {time} {hall}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenCurve />

        {/* Seat Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <View style={styles.gridContainer}>
            {seatLayout.map((rowSeats, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {/* Row Number */}
                <Text style={styles.rowLabel}>{rowIndex + 1}</Text>
                
                {/* Seats in Row */}
                <View style={styles.seatRow}>
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    let seatColor = SEAT_COLORS.regular;
                    if (seat.status === 'reserved') seatColor = SEAT_COLORS.reserved;
                    if (seat.status === 'vip') seatColor = SEAT_COLORS.vip;
                    if (isSelected) seatColor = SEAT_COLORS.selected;

                    return (
                      <Pressable
                        key={seat.id}
                        style={[styles.seatIcon, { backgroundColor: seatColor }]}
                        onPress={() => toggleSeat(seat)}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Zoom Controls (Visual only for now) */}
        <View style={styles.zoomControls}>
          <View style={styles.zoomButton}><Ionicons name="add" size={20} color="#202C43" /></View>
          <View style={styles.zoomDivider} />
          <View style={styles.zoomButton}><Ionicons name="remove" size={20} color="#202C43" /></View>
        </View>
        
        <View style={styles.legendDivider} />

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.seatIcon, { backgroundColor: SEAT_COLORS.selected }]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.seatIcon, { backgroundColor: SEAT_COLORS.reserved }]} />
              <Text style={styles.legendText}>Not available</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.seatIcon, { backgroundColor: SEAT_COLORS.vip }]} />
              <Text style={styles.legendText}>VIP (150$)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.seatIcon, { backgroundColor: SEAT_COLORS.regular }]} />
              <Text style={styles.legendText}>Regular (50 $)</Text>
            </View>
          </View>
        </View>

        {/* Selected Seat Tags */}
        {selectedSeats.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
            {selectedSeats.map(seat => (
              <View key={`tag-${seat.id}`} style={styles.seatTag}>
                <Text style={styles.seatTagText}>{seat.col} / {seat.row} row</Text>
                <Pressable onPress={() => toggleSeat(seat)}>
                  <Ionicons name="close" size={14} color="#202C43" style={{ marginLeft: 6 }} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>$ {totalPrice}</Text>
        </View>
        <Pressable 
          style={[styles.payButton, selectedSeats.length === 0 && { opacity: 0.5 }]} 
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.payButtonText}>Proceed to pay</Text>
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
    paddingTop: 50,
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
    paddingRight: 39,
  },
  movieTitle: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: '#202C43',
  },
  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: '#00C4FF',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  screenCurveContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  screenText: {
    fontFamily: theme.typography.medium,
    fontSize: 10,
    color: '#8F8F8F',
    marginTop: -20,
    letterSpacing: 1,
  },
  gridContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    fontFamily: theme.typography.medium,
    fontSize: 10,
    color: '#202C43',
    width: 20,
    textAlign: 'center',
    marginRight: 10,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seatIcon: {
    width: 14,
    height: 12,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  zoomControls: {
    flexDirection: 'row',
    position: 'absolute',
    right: 20,
    bottom: 220, // Approximate positioning above legend
    backgroundColor: '#F2F2F6',
    borderRadius: 8,
    padding: 4,
  },
  zoomButton: {
    padding: 4,
  },
  zoomDivider: {
    width: 1,
    backgroundColor: '#DBDBDF',
    marginHorizontal: 4,
  },
  legendDivider: {
    height: 3,
    backgroundColor: '#DBDBDF',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 2,
  },
  legendContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  legendRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: '#8F8F8F',
    marginLeft: 10,
  },
  tagsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  seatTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  seatTagText: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: '#202C43',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F6',
  },
  priceContainer: {
    flex: 1,
    backgroundColor: '#F2F2F6',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginRight: 15,
  },
  totalPriceLabel: {
    fontFamily: theme.typography.regular,
    fontSize: 10,
    color: '#202C43',
  },
  totalPriceValue: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: '#202C43',
    marginTop: 2,
  },
  payButton: {
    flex: 2,
    backgroundColor: '#00C4FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: '#FFF',
  }
});
