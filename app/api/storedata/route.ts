import { addDeviceReading } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import abi from "@/app/abi.json";

export async function POST(request: NextRequest) {
  try {
    // Check if content type is JSON
    const contentType = request.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const body = await request.json();

    console.log("Received data:", body);
    await addDeviceReading(body.device_id, body);

    // todo: hash data and send it to the contract
    return NextResponse.json({
      message: "Data received and logged successfully",
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "This endpoint accepts POST requests with JSON data",
    usage:
      "Send a POST request with Content-Type: application/json and a JSON body",
  });
}
