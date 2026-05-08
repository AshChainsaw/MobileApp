import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  if (__DEV__) {
    // DOCKER: Użyj lokalnego IP (nie localhost!)
    if (Platform.OS === 'android') {
      return 'http://192.168.1.100:5000/api';  // TWOJE IP!
    } else if (Platform.OS === 'ios') {
      return 'http://192.168.1.100:5000/api';  // TWOJE IP!
    }
  }
  
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

// Debug - sprawdź w logach
console.log('API_BASE_URL:', API_BASE_URL);
