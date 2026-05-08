import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulator: host machine
      return 'http://10.0.2.2:5000/api';
    } else if (Platform.OS === 'ios') {
      // iOS simulator: host machine
      return 'http://localhost:5000/api';
    }
  }
  
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

// Debug - sprawdź w logach
console.log('API_BASE_URL:', API_BASE_URL);
