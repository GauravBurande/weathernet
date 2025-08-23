"use client";

import { useEffect, useCallback } from "react";
import { useWeatherStore } from "@/lib/weather-store";
import { weatherService } from "@/lib/weather-service";

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

export function useWeatherData(
  autoPoll: boolean = true,
  pollInterval: number = 15000
) {
  const {
    weatherData,
    loading,
    error,
    lastUpdated,
    getLatestData,
    getDataByDevice,
    getStats,
  } = useWeatherStore();

  const refresh = useCallback(async () => {
    await weatherService.refresh();
  }, []);

  const startPolling = useCallback(() => {
    weatherService.startPolling(pollInterval);
  }, [pollInterval]);

  const stopPolling = useCallback(() => {
    weatherService.stopPolling();
  }, []);

  useEffect(() => {
    if (autoPoll) {
      startPolling();

      return () => {
        stopPolling();
      };
    }
  }, [autoPoll, startPolling, stopPolling]);

  return {
    // Data
    data: weatherData,
    latestData: getLatestData(),
    stats: getStats(),

    // State
    loading,
    error,
    lastUpdated,

    // Actions
    refresh,
    startPolling,
    stopPolling,

    // Utilities
    getDataByDevice,

    // Polling status
    isPolling: weatherService.getPollingStatus(),
  };
}
