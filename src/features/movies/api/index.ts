import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
}

interface UpcomingResponse {
  results: Movie[];
}

const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  const { data } = await apiClient.get<UpcomingResponse>('/movie/upcoming');
  return data.results;
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: fetchUpcomingMovies,
  });
};
