import axios from 'axios';

// The assignment provided a dummy key.
// In a real production app, this would be injected via react-native-dotenv.
const TMDB_API_KEY = 'c395cde56ce7207422ba42fc2c194122';
const BASE_URL = 'https://api.themoviedb.org/3';

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to automatically attach the API key to every outgoing request.
// This prevents us from having to manually append it to every endpoint URL.
apiClient.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.api_key = TMDB_API_KEY;
  return config;
});
