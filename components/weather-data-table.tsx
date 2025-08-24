"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useWeatherStore } from "@/lib/weather-store";
import { weatherService } from "@/lib/weather-service";

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getAQIStatus(sensorValue: number) {
  if (sensorValue == null || isNaN(sensorValue)) {
    return { label: "Unknown", variant: "secondary" as const };
  }

  // Normalize raw sensor values into approximate AQI categories
  // Assume 0–5000 sensor range
  if (sensorValue <= 500) return { label: "Good", variant: "default" as const };
  if (sensorValue <= 1000)
    return { label: "Moderate", variant: "secondary" as const };
  if (sensorValue <= 3000)
    return { label: "Unhealthy for Sensitive", variant: "secondary" as const };
  if (sensorValue <= 4000)
    return { label: "Unhealthy", variant: "destructive" as const };
  if (sensorValue <= 5000)
    return { label: "Very Unhealthy", variant: "destructive" as const };
  return { label: "Hazardous", variant: "destructive" as const };
}

// Map incoming Redis data to expected table format
function mapWeatherData(rawData: any) {
  return {
    device_id: rawData.device_id,
    sensors: {
      temperature_c: rawData.sensors.temperature_c,
      humidity_percent: rawData.sensors.humidityPercent, // map to expected key
      air_quality: rawData.sensors.airQuality, // map to expected key
      water_level: rawData.sensors.waterLevel, // for rain detection
    },
    location: rawData.location,
    timestamp: rawData.timestamp || null, // fallback if not present
  };
}

export function WeatherDataTable() {
  const { weatherData, loading, error } = useWeatherStore();

  // Map all data points to expected format
  const mappedData = Array.isArray(weatherData)
    ? weatherData.map(mapWeatherData)
    : [];

  const handleRefresh = async () => {
    await weatherService.refresh();
  };

  if (error) {
    return (
      <section id="real-time">
        <Card>
          <CardHeader>
            <CardTitle>Live Weather Data</CardTitle>
            <CardDescription>
              Real-time sensor readings from DePIN network nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    Failed to load weather data
                  </h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Weather Data</CardTitle>
            <CardDescription>
              Real-time sensor readings from DePIN network nodes
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && weatherData.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4" />
                      Temp (°C)
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      Humidity (%)
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4" />
                      Air Quality
                    </div>
                  </TableHead>
                  <TableHead>Water Level</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                  </TableHead>
                  {/* <TableHead>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last Update
                    </div>
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappedData.map((dataPoint) => {
                  const aqiStatus = getAQIStatus(
                    dataPoint?.sensors?.air_quality ?? 0
                  );
                  return (
                    <TableRow key={dataPoint.device_id}>
                      <TableCell className="font-medium">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {dataPoint.device_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {dataPoint.sensors.temperature_c}°C
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {dataPoint.sensors.humidity_percent}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-sm">
                            {dataPoint.sensors.air_quality}
                          </span>
                          <Badge
                            variant={aqiStatus.variant}
                            className="text-xs w-fit"
                          >
                            {aqiStatus.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {dataPoint.sensors.water_level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground font-mono">
                          {dataPoint.location.lat.toFixed(4)},{" "}
                          {dataPoint.location.lon.toFixed(4)}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {dataPoint.timestamp
                            ? formatTimestamp(dataPoint.timestamp)
                            : "-"}
                        </span>
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
