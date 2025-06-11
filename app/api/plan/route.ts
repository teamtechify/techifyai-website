// app/api/plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import Pusher from 'pusher';

// Validate environment variables during initialization
const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY; // Use the same key as frontend for consistency
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER; // Use the same cluster as frontend for consistency

if (!appId || !key || !secret || !cluster) {
  console.error("FATAL ERROR: Pusher environment variables are not fully configured!");
  // Optionally, throw an error during startup in production if needed
  // throw new Error("Pusher environment variables must be set.");
}

// Initialize Pusher client (only if all variables are present)
let pusher: Pusher | null = null;
if (appId && key && secret && cluster) {
  try {
    pusher = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
    console.log("Pusher server initialized successfully.");
  } catch (initError) {
    console.error("Failed to initialize Pusher server:", initError);
  }
} else {
    console.warn("Pusher server NOT initialized due to missing environment variables.");
}


/**
 * Handles POST requests from n8n webhook to trigger a Pusher event.
 * Expects a JSON body with `userID` and `documentID`.
 */
export async function POST(req: NextRequest) {
  if (!pusher) {
    console.error("Pusher server not initialized. Cannot process webhook.");
    return NextResponse.json(
        { success: false, error: "Internal Server Error: Notification system offline." },
        { status: 503 } // Service Unavailable
    );
  }

  try {
    const body = await req.json();
    // Log the raw body for debugging
    console.log("Webhook (/api/plan) POST received:", JSON.stringify(body));

    // Extract data safely
    const userID = body?.userID || body?.data?.userID;
    const documentURL = body?.documentURL || body?.data?.documentURL;

    // Validate required fields
    if (!userID || !documentURL) {
      console.error("Webhook error: Missing required fields 'userID' or 'documentURL'. Body:", body);
      return NextResponse.json(
        { success: false, error: "Missing required fields: userID and documentURL" },
        { status: 400 }
      );
    }

    // --- Trigger Pusher Event ---
    const channelName = `user-${userID}`; // User-specific channel
    const eventName = 'document-ready';
    const eventData = { documentURL: documentURL }; // Send URL in the format frontend expects

    console.log(`Attempting to trigger Pusher event for channel: ${channelName}, event: ${eventName}`);

    try {
      await pusher.trigger(channelName, eventName, eventData);
      console.log(`Pusher event triggered successfully for channel ${channelName}, event ${eventName}, data: ${JSON.stringify(eventData)}`);
    } catch (pusherError) {
      // Log the error but still return success to n8n unless critical
      const pusherErrorMessage = pusherError instanceof Error ? pusherError.message : 'Unknown Pusher error';
      console.error(`Failed to trigger Pusher event for user ${userID}:`, pusherErrorMessage, pusherError);
      // Optional: Return an error response if Pusher notification is critical
      // return NextResponse.json({ success: false, error: "Failed to notify client" }, { status: 500 });
    }
    // --- End Pusher Event Trigger ---

    // Respond success to n8n
    return NextResponse.json({
      success: true,
      message: `Notification triggered with document URL for user ${userID}.`
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error parsing request body';
    console.error("Error processing webhook (/api/plan):", errorMessage, error);
    return NextResponse.json(
      { success: false, error: "Invalid payload or server error." },
      { status: error instanceof SyntaxError ? 400 : 500 } // Bad Request for JSON errors
    );
  }
}

// The GET handler is removed as polling is deprecated.
// export async function GET(req: NextRequest) { ... } // REMOVED
