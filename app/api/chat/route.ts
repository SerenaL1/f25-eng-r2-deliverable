/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = (await request.json()) as { message?: string };

    // Validate input - check if message exists and is a string
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Invalid or missing message" }, { status: 400 });
    }

    // Trim the message and check if it's empty
    const message = body.message.trim();
    if (!message) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    // Call the AI service to generate a response
    const response = await generateResponse(message);

    // Return the response
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Return 502 for upstream/provider issues
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 502 });
  }
}
// TODO: Implement this file
