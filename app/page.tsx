import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { WeatherCharts } from "@/components/weather-charts"
import { WeatherDataTable } from "@/components/weather-data-table"
import { NetworkMap } from "@/components/network-map"
import { WalletConnect } from "@/components/wallet-connect"
import { Activity, Cloud, Droplets, Thermometer, Wind, MapPin, Zap } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">DePIN WeatherNet</h1>
                  <p className="text-sm text-muted-foreground">Avalanche C-Chain Fuji</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-primary border-primary/20">
                <Activity className="h-3 w-3 mr-1" />
                Live Network
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Network Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-xs text-muted-foreground">+2 from last hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Points</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">1,247</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AVAX Rewards</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">156.7</div>
                <p className="text-xs text-muted-foreground">Total distributed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">98.5%</div>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Wallet Connection */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your DePIN weather network participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-primary hover:bg-primary/90">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Network Map
                  </Button>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Real-time Data
                  </Button>
                  <Link href="/apply">
                    <Button variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Apply for Node
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Connection */}
            <WalletConnect />
          </div>

          {/* Recent Weather Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Weather Data</CardTitle>
              <CardDescription>Real-time data from active weather nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <Thermometer className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Temperature</p>
                      <p className="text-2xl font-bold">28.5°C</p>
                      <p className="text-xs text-muted-foreground">Node: esp32_001</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <Droplets className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Humidity</p>
                      <p className="text-2xl font-bold">65.2%</p>
                      <p className="text-xs text-muted-foreground">Node: esp32_001</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <Wind className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Air Quality</p>
                      <p className="text-2xl font-bold">213 AQI</p>
                      <p className="text-xs text-muted-foreground">Node: esp32_001</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Weather Data Visualization Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Weather Data Visualization</h2>
              <p className="text-muted-foreground">Real-time analytics from your DePIN weather network</p>
            </div>

            {/* Charts Section */}
            <WeatherCharts />

            {/* Network Map */}
            <NetworkMap />

            {/* Data Table */}
            <WeatherDataTable />
          </div>
        </div>
      </main>
    </div>
  )
}
