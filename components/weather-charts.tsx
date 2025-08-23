"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { useWeatherData } from "@/hooks/use-weather-data"
import { RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-2))",
  },
  aqi: {
    label: "Air Quality Index",
    color: "hsl(var(--chart-1))",
  },
  dataPoints: {
    label: "Data Points",
    color: "hsl(var(--chart-1))",
  },
}

export function WeatherCharts() {
  const { data, loading, error, refetch } = useWeatherData()

  // Process data for charts
  const temperatureData = data.slice(0, 6).map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    temperature: item.sensors.temperature_c,
    humidity: item.sensors.humidity_percent,
  }))

  const airQualityData = data.slice(0, 6).map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    aqi: item.sensors.air_quality_mq135,
  }))

  const nodeActivityData = data.reduce(
    (acc, item) => {
      const existing = acc.find((node) => node.node === item.device_id)
      if (existing) {
        existing.dataPoints += 1
      } else {
        acc.push({ node: item.device_id, dataPoints: 1 })
      }
      return acc
    },
    [] as { node: string; dataPoints: number }[],
  )

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Failed to load chart data</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <Button onClick={refetch} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading && data.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className={i === 3 ? "md:col-span-2" : ""}>
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Temperature and Humidity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature & Humidity</CardTitle>
          <CardDescription>Latest readings from active nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-muted-foreground" fontSize={12} />
                <YAxis className="text-muted-foreground" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Air Quality Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Index</CardTitle>
          <CardDescription>Latest AQI measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-muted-foreground" fontSize={12} />
                <YAxis className="text-muted-foreground" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Node Activity Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Node Activity</CardTitle>
          <CardDescription>Current data points from each active node</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nodeActivityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="node" className="text-muted-foreground" fontSize={12} />
                <YAxis className="text-muted-foreground" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="dataPoints" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
