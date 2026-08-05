import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { Movie } from './index';

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface VideosResponse {
  results: Video[];
}

const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
  const { data } = await apiClient.get<MovieDetails>(`/movie/${id}`);
  return data;
};

const fetchMovieVideos = async (id: number): Promise<Video[]> => {
  const { data } = await apiClient.get<VideosResponse>(`/movie/${id}/videos`);
  return data.results;
};

export const useMovieDetails = (id: number) => {
  return useQuery({
    queryKey: ['movieDetails', id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });
};

export const useMovieVideos = (id: number) => {
  return useQuery({
    queryKey: ['movieVideos', id],
    queryFn: () => fetchMovieVideos(id),
    enabled: !!id,
  });
};
