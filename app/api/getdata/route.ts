import { getLatestDeviceReadings } from "@/lib/redis";
import { deviceId } from "@/lib/utils";
import { NextResponse } from "next/server";

// {"device_id":"Node_Provider_1","sensors":{"temperature_c":2.40,"humidityPercent":27.30,"waterLevel":"Water Level: 2.83 ft","airQuality":2375},"location":{"lat":17.384300,"lon":78.458298}}

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const data = getLatestDeviceReadings(deviceId, 20);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error generating weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
