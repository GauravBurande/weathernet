"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Building, Wallet, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string

  // Organization (optional)
  organizationType: string
  organizationName: string

  // Location Information
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string

  // Technical Information
  internetConnection: string
  powerSource: string
  installationLocation: string
  technicalExperience: string

  // Blockchain Information
  avaxWalletAddress: string

  // Additional Information
  motivation: string
  additionalInfo: string

  // Agreements
  termsAccepted: boolean
  dataPrivacyAccepted: boolean
  maintenanceAccepted: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organizationType: "",
  organizationName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  internetConnection: "",
  powerSource: "",
  installationLocation: "",
  technicalExperience: "",
  avaxWalletAddress: "",
  motivation: "",
  additionalInfo: "",
  termsAccepted: false,
  dataPrivacyAccepted: false,
  maintenanceAccepted: false,
}

export function NodeApplicationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const { toast } = useToast()

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.termsAccepted || !formData.dataPrivacyAccepted || !formData.maintenanceAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept all terms and conditions to proceed.",
        variant: "destructive",
      })
      return
    }

    if (!formData.avaxWalletAddress.startsWith("0x") || formData.avaxWalletAddress.length !== 42) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid AVAX wallet address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application")
      }

      setApplicationId(result.applicationId)
      setIsSubmitted(true)
      toast({
        title: "Application Submitted!",
        description: `We'll review your application and contact you within ${result.estimatedReviewTime}.`,
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Application Submitted Successfully!</h2>
            <p className="text-muted-foreground">
              Thank you for your interest in becoming a DePIN WeatherNet node provider. Our team will review your
              application and contact you within 48 hours.
            </p>
            <div className="pt-4">
              <Badge variant="outline" className="text-primary border-primary/20">
                Application ID: {applicationId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Tell us about yourself and your contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Information (Optional)
          </CardTitle>
          <CardDescription>If you're applying on behalf of an organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organizationType">Organization Type</Label>
              <Select
                value={formData.organizationType}
                onValueChange={(value) => handleInputChange("organizationType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="educational">Educational Institution</SelectItem>
                  <SelectItem value="research">Research Organization</SelectItem>
                  <SelectItem value="government">Government Agency</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => handleInputChange("organizationName", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Installation Location
          </CardTitle>
          <CardDescription>Where will the weather station be installed?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                placeholder="e.g., 22.5726"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                placeholder="e.g., 88.3639"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Requirements</CardTitle>
          <CardDescription>Information about your technical setup and capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internetConnection">Internet Connection *</Label>
              <Select
                value={formData.internetConnection}
                onValueChange={(value) => handleInputChange("internetConnection", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiber">Fiber (100+ Mbps)</SelectItem>
                  <SelectItem value="cable">Cable (25-100 Mbps)</SelectItem>
                  <SelectItem value="dsl">DSL (5-25 Mbps)</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="mobile">Mobile/Cellular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="powerSource">Power Source *</Label>
              <Select value={formData.powerSource} onValueChange={(value) => handleInputChange("powerSource", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select power source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Power</SelectItem>
                  <SelectItem value="solar">Solar Power</SelectItem>
                  <SelectItem value="battery">Battery Backup</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Grid + Solar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installationLocation">Installation Location Type *</Label>
            <Select
              value={formData.installationLocation}
              onValueChange={(value) => handleInputChange("installationLocation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select installation location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rooftop">Rooftop</SelectItem>
                <SelectItem value="backyard">Backyard/Garden</SelectItem>
                <SelectItem value="balcony">Balcony</SelectItem>
                <SelectItem value="field">Open Field</SelectItem>
                <SelectItem value="building">Building Exterior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technicalExperience">Technical Experience *</Label>
            <Select
              value={formData.technicalExperience}
              onValueChange={(value) => handleInputChange("technicalExperience", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your technical experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (Basic computer skills)</SelectItem>
                <SelectItem value="intermediate">Intermediate (Some technical experience)</SelectItem>
                <SelectItem value="advanced">Advanced (Strong technical background)</SelectItem>
                <SelectItem value="expert">Expert (Professional IT/Engineering)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            AVAX Wallet Information
          </CardTitle>
          <CardDescription>Your AVAX wallet address for receiving rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avaxWalletAddress">AVAX Wallet Address *</Label>
            <Input
              id="avaxWalletAddress"
              placeholder="0x..."
              value={formData.avaxWalletAddress}
              onChange={(e) => handleInputChange("avaxWalletAddress", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Make sure this is a valid Avalanche C-Chain wallet address. Rewards will be sent to this address.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Tell us more about your motivation and any additional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to become a node provider? *</Label>
            <Textarea
              id="motivation"
              placeholder="Share your motivation for joining the DePIN WeatherNet..."
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional information you'd like to share..."
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
          <CardDescription>Please review and accept the following terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
            />
            <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
              I agree to the <span className="text-primary underline cursor-pointer">Terms of Service</span> and
              understand the responsibilities of operating a weather node in the DePIN network.
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="dataPrivacyAccepted"
              checked={formData.dataPrivacyAccepted}
              onCheckedChange={(checked) => handleInputChange("dataPrivacyAccepted", checked as boolean)}
            />
            <Label htmlFor="dataPrivacyAccepted" className="text-sm leading-relaxed">
              I acknowledge the <span className="text-primary underline cursor-pointer">Privacy Policy</span> and
              consent to the collection and processing of weather data from my location.
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="maintenanceAccepted"
              checked={formData.maintenanceAccepted}
              onCheckedChange={(checked) => handleInputChange("maintenanceAccepted", checked as boolean)}
            />
            <Label htmlFor="maintenanceAccepted" className="text-sm leading-relaxed">
              I commit to maintaining the weather station equipment and ensuring consistent data transmission to earn
              AVAX rewards.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            By submitting this application, you agree to all terms and conditions above.
          </p>
        </CardContent>
      </Card>
    </form>
  )
}
