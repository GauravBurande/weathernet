"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Zap,
  Thermometer,
  Droplets,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useWeatherStore } from "@/lib/weather-store";
import { useEffect, useState } from "react";

export function DashboardStats() {
  const { stats, lastUpdated, loading } = useWeatherStore();
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("");

  // Update time since last update every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const now = new Date();
        const diff = now.getTime() - lastUpdated.getTime();
        const seconds = Math.floor(diff / 1000);

        if (seconds < 60) {
          setTimeSinceUpdate(`${seconds}s ago`);
        } else if (seconds < 3600) {
          const minutes = Math.floor(seconds / 60);
          setTimeSinceUpdate(`${minutes}m ago`);
        } else {
          const hours = Math.floor(seconds / 3600);
          setTimeSinceUpdate(`${hours}h ago`);
        }
      } else {
        setTimeSinceUpdate("Never");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Calculate network health based on data freshness and node activity
  const getNetworkHealth = () => {
    if (!lastUpdated) return { percentage: 0, status: "Offline" };

    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds <= 30) return { percentage: 100, status: "Excellent" };
    if (seconds <= 60) return { percentage: 95, status: "Good" };
    if (seconds <= 120) return { percentage: 85, status: "Fair" };
    if (seconds <= 300) return { percentage: 70, status: "Poor" };
    return { percentage: 50, status: "Critical" };
  };

  const networkHealth = getNetworkHealth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Active Nodes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {loading ? "..." : stats.totalDevices}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalDevices > 0
              ? "Active weather stations"
              : "No nodes connected"}
          </p>
        </CardContent>
      </Card>

      {/* Data Points */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Points</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {loading ? "..." : stats.totalDataPoints.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {lastUpdated ? `Last update: ${timeSinceUpdate}` : "No data yet"}
          </p>
        </CardContent>
      </Card>

      {/* Average Temperature */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {loading ? "..." : `${stats.averageTemperature}°C`}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.averageTemperature > 0
              ? "Current average"
              : "No temperature data"}
          </p>
        </CardContent>
      </Card>

      {/* Network Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Health</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {loading ? "..." : `${networkHealth.percentage}%`}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {networkHealth.status}
            </p>
            <Badge
              variant={
                networkHealth.percentage >= 90
                  ? "default"
                  : networkHealth.percentage >= 70
                  ? "secondary"
                  : networkHealth.percentage >= 50
                  ? "outline"
                  : "destructive"
              }
              className="text-xs"
            >
              {networkHealth.percentage >= 90
                ? "✓"
                : networkHealth.percentage >= 70
                ? "⚠"
                : networkHealth.percentage >= 50
                ? "!"
                : "✗"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
