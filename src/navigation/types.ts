export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Details: { movieId: number };
  SeatMapping: { movieId: number };
  SeatSelection: { movieId: number; date: string; time: string; hall: string };
};
