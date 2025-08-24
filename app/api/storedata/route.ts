import { addDeviceReading } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import abi from "@/app/abi.json";
import { contractAddress } from "@/lib/utils";

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

    // await sendWeatherData(body);

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

// can't send on server side
// export const sendWeatherData = async (weatherData: any) => {
//   try {
//     const { ethereum } = window as any;
//     if (!ethereum) throw new Error("MetaMask not found");

//     const provider = new ethers.BrowserProvider(ethereum);
//     const signer = await provider.getSigner();

//     const { chainId } = await provider.getNetwork();
//     if (chainId !== BigInt(43113)) {
//       await ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: "0xa869" }], // 43113 hex
//       });
//     }

//     const contract = new ethers.Contract(contractAddress, abi, signer);

//     const jsonString = JSON.stringify(weatherData);
//     const dataHash = ethers.keccak256(ethers.toUtf8Bytes(jsonString));

//     console.log("Weather JSON:", jsonString);
//     console.log("Hashed Data:", dataHash);

//     const tx = await contract.storeHash(weatherData.device_id, dataHash);
//     console.log("Tx sent:", tx.hash);

//     const receipt = await tx.wait();
//     console.log("Tx confirmed:", receipt);

//     alert("Weather data successfully stored on Avalanche Fuji!");
//   } catch (err) {
//     console.error("Error sending weather data:", err);
//     alert("Failed to send weather data");
//   }
// };
