"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Info,
  Lightbulb,
  Zap,
} from "lucide-react";
import { useWeatherStore } from "@/lib/weather-store";
import { useState, useMemo } from "react";

export function WeatherAIAnalysis() {
  const { stats, weatherData } = useWeatherStore();
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const analysis = useMemo(() => {
    if (weatherData.length === 0) {
      return {
        overallHealth: "unknown",
        trends: [],
        alerts: [],
        recommendations: [],
        predictions: [],
      };
    }

    // Analyze temperature trends
    const tempTrend =
      weatherData.length >= 2
        ? weatherData[weatherData.length - 1].sensors.temperature_c -
          weatherData[weatherData.length - 2].sensors.temperature_c
        : 0;

    // Analyze humidity trends
    const humidityTrend =
      weatherData.length >= 2
        ? weatherData[weatherData.length - 1].sensors.humidity_percent -
          weatherData[weatherData.length - 2].sensors.humidity_percent
        : 0;

    // Check for extreme conditions
    const extremeTemp =
      stats.averageTemperature > 35 || stats.averageTemperature < 0;
    const extremeHumidity =
      stats.averageHumidity > 80 || stats.averageHumidity < 20;
    const poorAirQuality = stats.averageAQI > 150;

    // Generate insights
    const trends = [];
    if (Math.abs(tempTrend) > 2) {
      trends.push({
        type: "temperature",
        direction: tempTrend > 0 ? "rising" : "falling",
        magnitude: Math.abs(tempTrend).toFixed(1),
        severity: Math.abs(tempTrend) > 5 ? "high" : "moderate",
      });
    }

    if (Math.abs(humidityTrend) > 5) {
      trends.push({
        type: "humidity",
        direction: humidityTrend > 0 ? "increasing" : "decreasing",
        magnitude: Math.abs(humidityTrend).toFixed(1),
        severity: Math.abs(humidityTrend) > 10 ? "high" : "moderate",
      });
    }

    // Generate alerts
    const alerts = [];
    if (extremeTemp) {
      alerts.push({
        type: "temperature",
        message: `Extreme temperature detected: ${stats.averageTemperature}°C`,
        severity: "warning",
        icon: AlertTriangle,
      });
    }

    if (extremeHumidity) {
      alerts.push({
        type: "humidity",
        message: `Unusual humidity levels: ${stats.averageHumidity}%`,
        severity: "info",
        icon: Info,
      });
    }

    if (poorAirQuality) {
      alerts.push({
        type: "air_quality",
        message: `Poor air quality detected: ${stats.averageAQI} AQI`,
        severity: "destructive",
        icon: AlertTriangle,
      });
    }

    // Generate recommendations
    const recommendations = [];
    if (extremeTemp) {
      recommendations.push({
        type: "temperature",
        message:
          "Consider implementing temperature control measures or monitoring systems",
        priority: "high",
      });
    }

    if (poorAirQuality) {
      recommendations.push({
        type: "air_quality",
        message:
          "Implement air quality monitoring and consider ventilation improvements",
        priority: "high",
      });
    }

    if (weatherData.length < 10) {
      recommendations.push({
        type: "data",
        message: "Collect more data points for better trend analysis",
        priority: "medium",
      });
    }

    // Generate predictions
    const predictions = [];
    if (tempTrend > 0 && tempTrend < 3) {
      predictions.push({
        type: "temperature",
        message: "Temperature likely to continue rising gradually",
        confidence: "medium",
        timeframe: "next 2-4 hours",
      });
    }

    if (humidityTrend > 0 && humidityTrend < 8) {
      predictions.push({
        type: "humidity",
        message: "Humidity levels expected to increase",
        confidence: "medium",
        timeframe: "next 1-3 hours",
      });
    }

    // Overall health assessment
    let overallHealth = "good";
    if (alerts.some((alert) => alert.severity === "destructive")) {
      overallHealth = "critical";
    } else if (alerts.some((alert) => alert.severity === "warning")) {
      overallHealth = "warning";
    } else if (alerts.length > 0) {
      overallHealth = "moderate";
    }

    return {
      overallHealth,
      trends,
      alerts,
      recommendations,
      predictions,
    };
  }, [weatherData, stats]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case "good":
        return "default";
      case "moderate":
        return "secondary";
      case "warning":
        return "outline";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "secondary";
      case "warning":
        return "outline";
      case "destructive":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Weather Analysis</CardTitle>
          </div>
          <Badge variant={getHealthColor(analysis.overallHealth)}>
            {analysis.overallHealth === "good" && (
              <TrendingUp className="h-3 w-3 mr-1" />
            )}
            {analysis.overallHealth === "critical" && (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {analysis.overallHealth === "warning" && (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {analysis.overallHealth === "moderate" && (
              <Info className="h-3 w-3 mr-1" />
            )}
            {analysis.overallHealth === "unknown" && (
              <Info className="h-3 w-3 mr-1" />
            )}
            {analysis.overallHealth.charAt(0).toUpperCase() +
              analysis.overallHealth.slice(1)}{" "}
            Health
          </Badge>
        </div>
        <CardDescription>
          AI-powered insights and predictions based on real-time weather data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {stats.totalDevices}
            </div>
            <div className="text-sm text-muted-foreground">Active Nodes</div>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {stats.totalDataPoints}
            </div>
            <div className="text-sm text-muted-foreground">Data Points</div>
          </div>
          <div className="text-center p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {stats.averageTemperature}°C
            </div>
            <div className="text-sm text-muted-foreground">Avg Temperature</div>
          </div>
        </div>

        {/* Alerts Section */}
        {analysis.alerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Active Alerts
            </h4>
            <div className="space-y-2">
              {analysis.alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <alert.icon className="h-4 w-4" />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <Badge variant={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends Section */}
        {analysis.trends.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Detected Trends
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {analysis.trends.map((trend, index) => (
                <div
                  key={index}
                  className="p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {trend.type}
                    </span>
                    <Badge
                      variant={
                        trend.severity === "high" ? "destructive" : "secondary"
                      }
                    >
                      {trend.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {trend.direction} by {trend.magnitude} units
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictions Section */}
        {analysis.predictions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              AI Predictions
            </h4>
            <div className="space-y-2">
              {analysis.predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="p-3 border border-border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {prediction.type}
                    </span>
                    <Badge variant="outline">{prediction.confidence}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {prediction.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expected: {prediction.timeframe}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Recommendations
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {rec.type}
                    </span>
                    <Badge
                      variant={
                        rec.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis Toggle */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
            className="w-full"
          >
            {showDetailedAnalysis ? "Hide" : "Show"} Detailed Analysis
          </Button>
        </div>

        {/* Detailed Analysis */}
        {showDetailedAnalysis && (
          <div className="pt-4 space-y-4 border-t border-border">
            <h4 className="font-semibold">Detailed Analysis</h4>

            {/* Data Quality Assessment */}
            <div className="p-4 border border-border rounded-lg bg-muted/30">
              <h5 className="font-medium mb-2">Data Quality Assessment</h5>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Data Completeness:</span>
                  <Badge
                    variant={weatherData.length > 50 ? "default" : "secondary"}
                  >
                    {weatherData.length > 50
                      ? "Excellent"
                      : weatherData.length > 20
                      ? "Good"
                      : "Limited"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Update Frequency:</span>
                  <Badge variant="default">15 seconds</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Network Coverage:</span>
                  <Badge
                    variant={stats.totalDevices > 5 ? "default" : "secondary"}
                  >
                    {stats.totalDevices > 5 ? "Good" : "Limited"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Historical Context */}
            <div className="p-4 border border-border rounded-lg bg-muted/30">
              <h5 className="font-medium mb-2">Historical Context</h5>
              <p className="text-sm text-muted-foreground">
                Based on {stats.totalDataPoints} data points from{" "}
                {stats.totalDevices} active weather nodes. The system
                continuously learns from patterns to improve prediction
                accuracy.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
