"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  Building,
  Wallet,
  Send,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { contractAddress, deviceId } from "@/lib/utils";
import abi from "@/app/abi.json";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;

  // Organization (optional)
  organizationName: string;

  // Location Information
  city: string;
  state: string;
  country: string;

  // Technical Information
  technicalExperience: string;

  // Blockchain Information
  avaxWalletAddress: string;

  // Additional Information
  motivation: string;

  // Agreements
  termsAccepted: boolean;
  dataPrivacyAccepted: boolean;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  organizationName: "",
  city: "",
  state: "",
  country: "",
  technicalExperience: "",
  avaxWalletAddress: "",
  motivation: "",
  termsAccepted: false,
  dataPrivacyAccepted: false,
};

export function NodeApplicationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const { toast } = useToast();

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function getContract() {
    const { ethereum } = window as any;
    if (!ethereum) throw new Error("MetaMask not found");

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const { chainId } = await provider.getNetwork();
    if (chainId !== BigInt(43113)) {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa869" }], // Fuji Testnet
      });
    }

    return new ethers.Contract(contractAddress, abi, signer);
  }

  const initiateNode = async (device_id: string, tokenAddress: string) => {
    try {
      const contract = await getContract();

      // Check if node already exists
      const node = await contract.nodes(device_id);
      if (node.owner !== ethers.ZeroAddress) {
        alert("⚠️ Node already initiated for this device.");
        return;
      }

      // Call initiateNode
      const tx = await contract.initiateNode(device_id, tokenAddress);
      console.log("Initiate tx sent:", tx.hash);

      const receipt = await tx.wait();
      if (receipt.status === BigInt(1)) {
        alert(`🎉 Node initiated successfully for ${device_id}`);
      } else {
        alert("⚠️ Node initiation failed.");
      }
    } catch (err: any) {
      console.error("❌ Initiate error:", err);
      if (err.code === 4001) {
        alert("User rejected transaction");
      } else {
        alert("Node initiation failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.termsAccepted || !formData.dataPrivacyAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept all terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.avaxWalletAddress.startsWith("0x") ||
      formData.avaxWalletAddress.length !== 42
    ) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid AVAX wallet address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      initiateNode(deviceId, formData.avaxWalletAddress);

      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setApplicationId(result.applicationId);
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: `We'll review your application and contact you within ${result.estimatedReviewTime}.`,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">
              Application Submitted Successfully!
            </h2>
            <p className="text-muted-foreground">
              Thank you for your interest in becoming a DePIN WeatherNet node
              provider. Our team will review your application and contact you
              within 48 hours.
            </p>
            <div className="pt-4">
              <Badge
                variant="outline"
                className="text-primary border-primary/20"
              >
                Application ID: {applicationId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Tell us about yourself and your contact information
          </CardDescription>
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
            <Label htmlFor="organizationName">
              Organization Name (Optional)
            </Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) =>
                handleInputChange("organizationName", e.target.value)
              }
              placeholder="Your company or organization"
            />
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
          <CardDescription>
            Where will the weather station be installed?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
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
          </div>
        </CardContent>
      </Card>

      {/* Technical Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Requirements</CardTitle>
          <CardDescription>
            Information about your technical setup and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="technicalExperience">Technical Experience *</Label>
            <Select
              value={formData.technicalExperience}
              onValueChange={(value) =>
                handleInputChange("technicalExperience", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your technical experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  Beginner (Basic computer skills)
                </SelectItem>
                <SelectItem value="intermediate">
                  Intermediate (Some technical experience)
                </SelectItem>
                <SelectItem value="advanced">
                  Advanced (Strong technical background)
                </SelectItem>
                <SelectItem value="expert">
                  Expert (Professional IT/Engineering)
                </SelectItem>
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
          <CardDescription>
            Your AVAX wallet address for receiving rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avaxWalletAddress">AVAX Wallet Address *</Label>
            <Input
              id="avaxWalletAddress"
              placeholder="0x..."
              value={formData.avaxWalletAddress}
              onChange={(e) =>
                handleInputChange("avaxWalletAddress", e.target.value)
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              Make sure this is a valid Avalanche C-Chain wallet address.
              Rewards will be sent to this address.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Tell us more about your motivation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivation">
              Why do you want to become a node provider? *
            </Label>
            <Textarea
              id="motivation"
              placeholder="Share your motivation for joining the DePIN WeatherNet..."
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              required
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
          <CardDescription>
            Please review and accept the following terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) =>
                handleInputChange("termsAccepted", checked as boolean)
              }
            />
            <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
              I agree to the{" "}
              <span className="text-primary underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and understand the responsibilities of operating a weather node in
              the DePIN network.
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="dataPrivacyAccepted"
              checked={formData.dataPrivacyAccepted}
              onCheckedChange={(checked) =>
                handleInputChange("dataPrivacyAccepted", checked as boolean)
              }
            />
            <Label
              htmlFor="dataPrivacyAccepted"
              className="text-sm leading-relaxed"
            >
              I acknowledge the{" "}
              <span className="text-primary underline cursor-pointer">
                Privacy Policy
              </span>{" "}
              and consent to the collection and processing of weather data from
              my location.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            disabled={isSubmitting}
          >
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
            By submitting this application, you agree to all terms and
            conditions above.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
