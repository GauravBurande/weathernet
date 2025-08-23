import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { WeatherCharts } from "@/components/weather-charts";
import { WeatherDataTable } from "@/components/weather-data-table";
import { WeatherAIAnalysis } from "@/components/weather-ai-analysis";
import { NetworkMap } from "@/components/network-map";
import { WalletConnect } from "@/components/wallet-connect";
import {
  Activity,
  Cloud,
  Droplets,
  Thermometer,
  Wind,
  MapPin,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats } from "@/components/dashboard-stats";
import logo from "@/app/icon.png";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image className="h-12 w-12" alt="weathernet" src={logo} />
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    WeatherNet
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="text-primary border-primary/20"
              >
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
          {/* Network Overview - Now using global store */}
          {/* <DashboardStats /> */}

          {/* Quick Actions and Wallet Connection */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your DePIN weather network participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Link href="#network-map">
                    <Button className="bg-primary cursor-pointer hover:bg-primary/90">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Network Map
                    </Button>
                  </Link>
                  <Link href="#real-time">
                    <Button className="cursor-pointer" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Real-time Data
                    </Button>
                  </Link>
                  <Link href="/apply">
                    <Button className="cursor-pointer" variant="outline">
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

          {/* Comprehensive Weather Data Visualization Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Weather Data Visualization
              </h2>
              <p className="text-muted-foreground">
                Real-time analytics from your DePIN weather network
              </p>
            </div>

            {/* Data Table */}
            <WeatherDataTable />

            {/* AI Analysis Section */}
            <WeatherAIAnalysis />

            {/* Charts Section */}
            <WeatherCharts />

            {/* Network Map */}
            <NetworkMap />
          </div>
        </div>
      </main>
    </div>
  );
}
