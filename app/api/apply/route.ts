import { type NextRequest, NextResponse } from "next/server"

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  organizationType: string
  organizationName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  internetConnection: string
  powerSource: string
  installationLocation: string
  technicalExperience: string
  avaxWalletAddress: string
  motivation: string
  additionalInfo: string
  termsAccepted: boolean
  dataPrivacyAccepted: boolean
  maintenanceAccepted: boolean
}

export async function POST(request: NextRequest) {
  try {
    const data: ApplicationData = await request.json()

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "country",
      "internetConnection",
      "powerSource",
      "installationLocation",
      "technicalExperience",
      "avaxWalletAddress",
      "motivation",
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate agreements
    if (!data.termsAccepted || !data.dataPrivacyAccepted || !data.maintenanceAccepted) {
      return NextResponse.json({ error: "All terms and conditions must be accepted" }, { status: 400 })
    }

    // Validate AVAX wallet address format
    if (!data.avaxWalletAddress.startsWith("0x") || data.avaxWalletAddress.length !== 42) {
      return NextResponse.json({ error: "Invalid AVAX wallet address format" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate application ID
    const applicationId = `WN-${Date.now().toString().slice(-6)}`

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admin team
    // 4. Add to review queue

    console.log("New node application received:", {
      applicationId,
      applicant: `${data.firstName} ${data.lastName}`,
      email: data.email,
      location: `${data.city}, ${data.state}, ${data.country}`,
      walletAddress: data.avaxWalletAddress,
    })

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Application submitted successfully",
      estimatedReviewTime: "48 hours",
    })
  } catch (error) {
    console.error("Error processing application:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
