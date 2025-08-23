import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface WeatherDataPoint {
  device_id: string;
  timestamp: string;
  sensors: {
    temperature_c: number;
    humidity_percent: number;
    rain_detected: boolean;
    air_quality_mq135: number;
  };
  location: {
    lat: number;
    lon: number;
  };
}

interface WeatherStats {
  totalDevices: number;
  totalDataPoints: number;
  averageTemperature: number;
  averageHumidity: number;
  averageAQI: number;
}

interface WeatherStore {
  // State
  weatherData: WeatherDataPoint[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  stats: WeatherStats;

  // Actions
  setWeatherData: (data: WeatherDataPoint[]) => void;
  appendWeatherData: (data: WeatherDataPoint[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: Date) => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      weatherData: [],
      loading: false,
      error: null,
      lastUpdated: null,
      stats: {
        totalDevices: 0,
        totalDataPoints: 0,
        averageTemperature: 0,
        averageHumidity: 0,
        averageAQI: 0,
      },

      // Actions
      setWeatherData: (data) =>
        set(() => {
          const stats = calculateStats(data);
          return {
            weatherData: data,
            lastUpdated: new Date(),
            error: null,
            stats,
          };
        }),

      appendWeatherData: (data) =>
        set((state) => {
          const newData = [...state.weatherData, ...data];
          const stats = calculateStats(newData);
          return {
            weatherData: newData,
            lastUpdated: new Date(),
            error: null,
            stats,
          };
        }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error, loading: false }),

      setLastUpdated: (date) => set({ lastUpdated: date }),

      clearError: () => set({ error: null }),
    }),
    { name: "weather-store" }
  )
);

// Helper function to compute stats
function calculateStats(data: WeatherDataPoint[]): WeatherStats {
  if (data.length === 0) {
    return {
      totalDevices: 0,
      totalDataPoints: 0,
      averageTemperature: 0,
      averageHumidity: 0,
      averageAQI: 0,
    };
  }

  const uniqueDevices = new Set(data.map((point) => point.device_id));
  const totalDataPoints = data.length;

  const avgTemp =
    data.reduce((sum, point) => sum + point.sensors.temperature_c, 0) /
    totalDataPoints;
  const avgHumidity =
    data.reduce((sum, point) => sum + point.sensors.humidity_percent, 0) /
    totalDataPoints;
  const avgAQI =
    data.reduce((sum, point) => sum + point.sensors.air_quality_mq135, 0) /
    totalDataPoints;

  return {
    totalDevices: uniqueDevices.size,
    totalDataPoints,
    averageTemperature: Math.round(avgTemp * 100) / 100,
    averageHumidity: Math.round(avgHumidity * 100) / 100,
    averageAQI: Math.round(avgAQI * 100) / 100,
  };
}
