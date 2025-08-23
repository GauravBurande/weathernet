"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Thermometer } from "lucide-react"

// Mock data for map visualization
const nodeLocations = [
  {
    device_id: "esp32_node_001",
    location: { lat: 22.5726, lon: 88.3639 },
    status: "active",
    temperature: 28.5,
    lastSeen: "2 min ago",
  },
  {
    device_id: "esp32_node_002",
    location: { lat: 22.5856, lon: 88.3428 },
    status: "active",
    temperature: 26.8,
    lastSeen: "1 min ago",
  },
  {
    device_id: "esp32_node_003",
    location: { lat: 22.5634, lon: 88.3712 },
    status: "active",
    temperature: 29.1,
    lastSeen: "3 min ago",
  },
  {
    device_id: "esp32_node_004",
    location: { lat: 22.5789, lon: 88.3521 },
    status: "offline",
    temperature: 27.3,
    lastSeen: "15 min ago",
  },
]

export function NetworkMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Map</CardTitle>
        <CardDescription>Geographic distribution of weather nodes</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for actual map - would integrate with a mapping library */}
        <div className="relative bg-muted/20 rounded-lg h-96 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Interactive Map View</p>
            <p className="text-sm text-muted-foreground">
              Integration with mapping service would display node locations
            </p>
          </div>
        </div>

        {/* Node List */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium">Active Nodes</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {nodeLocations.map((node) => (
              <div
                key={node.device_id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      node.status === "active" ? "bg-primary" : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{node.device_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {node.location.lat.toFixed(4)}, {node.location.lon.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-mono">{node.temperature}°C</span>
                  </div>
                  <Badge variant={node.status === "active" ? "default" : "secondary"} className="text-xs">
                    {node.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
