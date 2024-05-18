import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: "Please specify an endpoint to access the desired resource.",
  });
}
