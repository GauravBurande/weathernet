import { NodeApplicationForm } from "@/components/node-application-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Cloud, ArrowLeft, Zap, MapPin, Shield, Coins } from "lucide-react"
import Link from "next/link"

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">DePIN WeatherNet</h1>
                  <p className="text-sm text-muted-foreground">Node Provider Application</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-primary border-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                Earn AVAX
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Become a Weather Node Provider</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the DePIN WeatherNet and earn AVAX tokens by providing valuable weather data to the network
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <Coins className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Earn AVAX Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Get rewarded with AVAX tokens for every data point your weather station contributes to the network
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Be part of a decentralized weather monitoring network spanning across multiple continents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Built on Avalanche blockchain ensuring secure, transparent, and reliable data transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <NodeApplicationForm />
        </div>
      </main>
    </div>
  )
}
