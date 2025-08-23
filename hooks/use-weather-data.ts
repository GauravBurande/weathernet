"use client"

import { useState, useEffect } from "react"

export interface WeatherDataPoint {
  device_id: string
  timestamp: string
  sensors: {
    temperature_c: number
    humidity_percent: number
    rain_detected: boolean
    air_quality_mq135: number
  }
  location: {
    lat: number
    lon: number
  }
}

export function useWeatherData(refreshInterval = 30000) {
  const [data, setData] = useState<WeatherDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/getdata")
      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }
      const weatherData = await response.json()
      setData(weatherData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return { data, loading, error, refetch: fetchData }
}
