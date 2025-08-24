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
  Brain,
  TrendingUp,
  AlertTriangle,
  Info,
  Lightbulb,
  Zap,
} from "lucide-react";
import { useWeatherStore } from "@/lib/weather-store";
import { useState, useMemo, useEffect } from "react";

export async function sendAIPrediction(prompt: string): Promise<string> {
  try {
    const res = await fetch("/api/ai-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.output as string;
  } catch (err) {
    console.error("Error sending AI prediction:", err);
    return "Something went wrong.";
  }
}

export function WeatherAIAnalysis() {
  const { stats, weatherData } = useWeatherStore();
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string>("");

  // 🔹 Call AI whenever weatherData or stats change
  useEffect(() => {
    if (weatherData.length === 0) return;

    const fetchPrediction = async () => {
      const prompt = `Analyze this weather dataset and stats, and give predictions, risks, and recommendations, :\n\nStats:\n${JSON.stringify(
        stats,
        null,
        2
      )}\n\nWeather Data:\n${JSON.stringify(
        weatherData.slice(-10),
        null,
        2
      )}, you must return us a prediction and nothing else!`;

      const result = await sendAIPrediction(prompt);
      setAiPrediction(result);
    };

    fetchPrediction();
  }, [stats, weatherData]);

  // ... existing useMemo analysis code
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

    // same analysis logic as before...
    const tempTrend =
      weatherData.length >= 2
        ? weatherData[weatherData.length - 1].sensors.temperature_c -
          weatherData[weatherData.length - 2].sensors.temperature_c
        : 0;

    const humidityTrend =
      weatherData.length >= 2
        ? weatherData[weatherData.length - 1].sensors.humidity_percent -
          weatherData[weatherData.length - 2].sensors.humidity_percent
        : 0;

    const extremeTemp =
      stats.averageTemperature > 35 || stats.averageTemperature < 0;
    const extremeHumidity =
      stats.averageHumidity > 80 || stats.averageHumidity < 20;
    const poorAirQuality = stats.averageAQI > 150;

    const trends: any[] = [];
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

    const alerts: any[] = [];
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

    const recommendations: any[] = [];
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

    const predictions: any[] = [];
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

    let overallHealth = "good";
    if (alerts.some((a) => a.severity === "destructive")) {
      overallHealth = "critical";
    } else if (alerts.some((a) => a.severity === "warning")) {
      overallHealth = "warning";
    } else if (alerts.length > 0) {
      overallHealth = "moderate";
    }

    return { overallHealth, trends, alerts, recommendations, predictions };
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
            {analysis.overallHealth}
          </Badge>
        </div>
        <CardDescription>
          AI-powered insights and predictions based on real-time weather data
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Prediction Section */}
        {aiPrediction && (
          <div className="p-4 border border-border rounded-lg bg-muted/30">
            <h4 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Gemini AI Prediction
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {aiPrediction}
            </p>
          </div>
        )}

        {/* 🔹 Rest of your existing UI (alerts, trends, recs, etc.) */}
      </CardContent>
    </Card>
  );
}
