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

function getAQIStatus(aqi: number) {
  if (aqi == null || isNaN(aqi)) {
    return { label: "Unknown", variant: "secondary" as const };
  }

  if (aqi <= 50) return { label: "Good", variant: "default" as const };
  if (aqi <= 100) return { label: "Moderate", variant: "secondary" as const };
  if (aqi <= 150)
    return { label: "Unhealthy for Sensitive", variant: "outline" as const };
  if (aqi <= 200)
    return { label: "Unhealthy", variant: "destructive" as const };
  return { label: "Very Unhealthy", variant: "destructive" as const };
}

export function WeatherDataTable() {
  const { weatherData, loading, error } = useWeatherStore();

  const handleRefresh = async () => {
    await weatherService.refresh();
  };

  if (error) {
    return (
      <Card id="real-time">
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
                  <TableHead>Rain</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last Update
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weatherData.map((dataPoint) => {
                  const aqiStatus = getAQIStatus(
                    dataPoint?.sensors?.air_quality_mq135 ?? 0
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
                            {dataPoint.sensors.air_quality_mq135}
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
                        <Badge
                          variant={
                            dataPoint.sensors.rain_detected
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {dataPoint.sensors.rain_detected
                            ? "Detected"
                            : "None"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground font-mono">
                          {dataPoint.location.lat.toFixed(4)},{" "}
                          {dataPoint.location.lon.toFixed(4)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(dataPoint.timestamp)}
                        </span>
                      </TableCell>
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
