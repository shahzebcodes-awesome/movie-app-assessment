import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { Movie } from './index';

interface SearchResponse {
  results: Movie[];
}

const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const { data } = await apiClient.get<SearchResponse>('/search/movie', {
    params: { query },
  });
  return data.results;
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['searchMovies', query],
    queryFn: () => searchMovies(query),
    enabled: !!query, // Only fetch if there's a query
  });
};
