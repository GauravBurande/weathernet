import { NextResponse } from "next/server";

// Mock data matching the specified schema
const generateWeatherData = () => {
  const devices = [
    { id: "esp32_node_001", lat: 22.5726, lon: 88.3639 },
    { id: "esp32_node_002", lat: 22.5856, lon: 88.3428 },
    { id: "esp32_node_003", lat: 22.5634, lon: 88.3712 },
    { id: "esp32_node_004", lat: 22.5789, lon: 88.3521 },
    { id: "esp32_node_005", lat: 22.5645, lon: 88.3598 },
    { id: "esp32_node_006", lat: 22.5712, lon: 88.3456 },
  ];

  return devices.map((device) => ({
    device_id: device.id,
    timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(), // Random timestamp within last 5 minutes
    sensors: {
      temperature_c: Math.round((20 + Math.random() * 15) * 10) / 10, // 20-35°C
      humidity_percent: Math.round((45 + Math.random() * 35) * 10) / 10, // 45-80%
      rain_detected: Math.random() > 0.8, // 20% chance of rain
      air_quality_mq135: Math.round(150 + Math.random() * 100), // 150-250 AQI
    },
    location: {
      lat: device.lat,
      lon: device.lon,
    },
  }));
};

// {"device_id":"Node_Provider_1","sensors":{"temperature_c":2.40,"humidityPercent":27.30,"waterLevel":"Water Level: 2.83 ft","airQuality":2375},"location":{"lat":17.384300,"lon":78.458298}}

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const data = generateWeatherData();

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
