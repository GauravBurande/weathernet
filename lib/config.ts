// Configuration file for easy switching between development and production modes

interface BaseWeatherConfig {
  pollInterval: number;
  appendInDevelopment: boolean;
  maxDataPoints: number;
  endpoints: {
    getData: string;
    storeData: string;
    apply: string;
  };
}

interface DevelopmentConfig extends BaseWeatherConfig {
  simulateRealTime: boolean;
  artificialDelay: number;
}

interface ProductionConfig extends BaseWeatherConfig {
  replaceData: boolean;
  enableMonitoring: boolean;
  retryAttempts: number;
  retryDelay: number;
}

export const config = {
  // Weather data polling configuration
  weather: {
    // Polling interval in milliseconds
    pollInterval: 15000, // 15 seconds

    // Whether to append data in development mode (simulates real-time updates)
    // In production, this should be false to replace data instead of appending
    appendInDevelopment: process.env.NODE_ENV === "development",

    // Maximum data points to keep in memory (to prevent memory issues)
    maxDataPoints: 1000,

    // API endpoints
    endpoints: {
      getData: "/api/getdata",
      storeData: "/api/storedata",
      apply: "/api/apply",
    },
  },

  // Development mode settings
  development: {
    // Simulate real-time data updates by appending new data
    simulateRealTime: true,

    // Add artificial delay to simulate network latency
    artificialDelay: 500, // milliseconds
  },

  // Production mode settings
  production: {
    // Replace data instead of appending (real API behavior)
    replaceData: true,

    // Enable error reporting and monitoring
    enableMonitoring: true,

    // Retry configuration for failed API calls
    retryAttempts: 3,
    retryDelay: 2000, // milliseconds
  },
};

// Helper function to get current environment
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

// Helper function to get weather config based on environment
export const getWeatherConfig = (): DevelopmentConfig | ProductionConfig => {
  if (isProduction) {
    return {
      ...config.weather,
      appendInDevelopment: false,
      ...config.production,
    } as ProductionConfig;
  }

  return {
    ...config.weather,
    appendInDevelopment: true,
    ...config.development,
  } as DevelopmentConfig;
};
