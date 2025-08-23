import { NextRequest, NextResponse } from "next/server";

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

    console.log("Request Body:", JSON.stringify(body, null, 2));
    console.log(
      "Request Headers:",
      Object.fromEntries(request.headers.entries())
    );

    // Return success response
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
