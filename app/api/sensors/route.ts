import { NextRequest, NextResponse } from "next/server";

let sensorData: Record<string, unknown> = {
  temperature: null,
  humidity: null,
  devices: [],
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: sensorData,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    sensorData = { ...sensorData, ...body };
    return NextResponse.json({
      success: true,
      message: "Data received",
      data: sensorData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON payload",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
