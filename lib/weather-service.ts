import { useWeatherStore } from "./weather-store";
import { getWeatherConfig } from "./config";

export class WeatherDataService {
  private static instance: WeatherDataService;
  private pollInterval: NodeJS.Timeout | null = null;
  private isPolling = false;
  private retryCount = 0;

  private constructor() {}

  static getInstance(): WeatherDataService {
    if (!WeatherDataService.instance) {
      WeatherDataService.instance = new WeatherDataService();
    }
    return WeatherDataService.instance;
  }

  // Fetch data from API endpoint
  async fetchWeatherData(): Promise<void> {
    const store = useWeatherStore.getState();
    const config = getWeatherConfig();

    try {
      store.setLoading(true);
      store.clearError();

      const response = await fetch(config.endpoints.getData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Apply data based on configuration
        if (config.appendInDevelopment) {
          // Development mode: append data to simulate real-time updates
          store.appendWeatherData(data);
        } else {
          // Production mode: replace existing data
          store.setWeatherData(data);
        }

        // Reset retry count on success
        this.retryCount = 0;
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch weather data";
      store.setError(errorMessage);
      console.error("Weather data fetch error:", error);

      // Implement retry logic for production
      if (
        config.production.enableMonitoring &&
        this.retryCount < config.retryAttempts
      ) {
        this.retryCount++;
        console.log(
          `Retrying weather data fetch (attempt ${this.retryCount}/${config.retryAttempts})`
        );

        // Retry after delay
        setTimeout(() => {
          this.fetchWeatherData();
        }, config.retryDelay);
      }
    } finally {
      store.setLoading(false);
    }
  }

  // Start polling for data
  startPolling(intervalMs?: number): void {
    if (this.isPolling) {
      this.stopPolling();
    }

    const config = getWeatherConfig();
    const pollInterval = intervalMs || config.pollInterval;

    this.isPolling = true;

    // Initial fetch
    this.fetchWeatherData();

    // Set up interval
    this.pollInterval = setInterval(() => {
      this.fetchWeatherData();
    }, pollInterval);

    console.log(`Weather data polling started with ${pollInterval}ms interval`);
  }

  // Stop polling
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
    console.log("Weather data polling stopped");
  }

  // Check if currently polling
  getPollingStatus(): boolean {
    return this.isPolling;
  }

  // Manual refresh
  async refresh(): Promise<void> {
    await this.fetchWeatherData();
  }

  // Get current configuration
  getConfig() {
    return getWeatherConfig();
  }

  // Update polling interval
  updatePollingInterval(newInterval: number): void {
    if (this.isPolling) {
      this.stopPolling();
      this.startPolling(newInterval);
    }
  }
}

// Export singleton instance
export const weatherService = WeatherDataService.getInstance();
