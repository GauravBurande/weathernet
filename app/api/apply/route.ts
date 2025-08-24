import { setRedisObject } from "@/lib/redis";
import { type NextRequest, NextResponse } from "next/server";

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  city: string;
  state: string;
  country: string;
  technicalExperience: string;
  avaxWalletAddress: string;
  motivation: string;
  termsAccepted: boolean;
  dataPrivacyAccepted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: ApplicationData = await request.json();

    const requiredFields: (keyof ApplicationData)[] = [
      "firstName",
      "lastName",
      "email",
      "organizationName",
      "city",
      "state",
      "country",
      "technicalExperience",
      "avaxWalletAddress",
      "motivation",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!data.termsAccepted || !data.dataPrivacyAccepted) {
      return NextResponse.json(
        { error: "You must accept Terms and Data Privacy" },
        { status: 400 }
      );
    }

    // ✅ Validate AVAX wallet address format
    if (
      !data.avaxWalletAddress.startsWith("0x") ||
      data.avaxWalletAddress.length !== 42
    ) {
      return NextResponse.json(
        { error: "Invalid AVAX wallet address format" },
        { status: 400 }
      );
    }

    // Generate application ID
    const applicationId = `WN-${Date.now().toString().slice(-6)}`;

    console.log("New node application received:", {
      applicationId,
      applicant: `${data.firstName} ${data.lastName}`,
      email: data.email,
      location: `${data.city}, ${data.state}, ${data.country}`,
      walletAddress: data.avaxWalletAddress,
    });

    await setRedisObject(data.avaxWalletAddress, JSON.stringify(data));
    return NextResponse.json({
      success: true,
      applicationId,
      message: "Application submitted successfully",
      estimatedReviewTime: "48 hours",
    });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}
