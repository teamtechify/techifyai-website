// app/api/plan/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Interface for storing pending document data.
 */
interface DocumentData {
  documentID: string;
  text?: string; // Optional accompanying text
  timestamp: number; // Expiration timestamp (Date.now() + TTL)
}

// Use a Map for efficient in-memory storage (key: userID, value: DocumentData)
// NOTE: This is in-memory and will be lost on server restart.
// For production, consider using a database or persistent cache (e.g., Redis).
const pendingDocuments = new Map<string, DocumentData>();

const DOCUMENT_TTL_MS = 30 * 60 * 1000; // 30 minutes Time-To-Live for pending documents

/**
 * Cleans up expired documents from the Map.
 */
const cleanupExpiredDocuments = () => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [userID, data] of pendingDocuments.entries()) {
    if (data.timestamp < now) {
      pendingDocuments.delete(userID);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired pending documents.`);
  }
};

/**
 * Handles POST requests to store pending document notifications.
 * Expects a JSON body with `userID` and `documentID`.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Log the raw body for debugging (consider redacting sensitive info in production)
    console.log("Webhook (/api/plan) POST received:", JSON.stringify(body));

    // Extract data safely, assuming it might be nested or have different structures
    const userID = body?.userID || body?.data?.userID;
    const documentID = body?.documentID || body?.data?.documentID;
    const text = body?.text || body?.data?.text; // Optional text

    // Validate required fields
    if (!userID || !documentID) {
      console.error("Webhook error: Missing required fields 'userID' or 'documentID'. Body:", body);
      return NextResponse.json(
        { success: false, error: "Missing required fields: userID and documentID" },
        { status: 400 }
      );
    }

    // Store the document data with an expiration timestamp
    const expirationTime = Date.now() + DOCUMENT_TTL_MS;
    pendingDocuments.set(userID, {
      documentID,
      text: text, // Store text if provided
      timestamp: expirationTime,
    });

    console.log(`Document ${documentID} stored for user ${userID}. Expires at ${new Date(expirationTime).toISOString()}.`);

    // Optionally, run cleanup periodically or on POST/GET
    cleanupExpiredDocuments();

    return NextResponse.json({
      success: true,
      message: `Document ${documentID} ready for retrieval by user ${userID}.`
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

/**
 * Handles GET requests to retrieve a pending document for a specific user.
 * Expects a `userID` query parameter.
 */
export async function GET(req: NextRequest) {
  const userID = req.nextUrl.searchParams.get("userID");

  if (!userID) {
    console.warn("Webhook GET request missing userID parameter.");
    return NextResponse.json(
      { error: "Missing userID query parameter" },
      { status: 400 }
    );
  }

  console.log(`Webhook GET request received for user ${userID}.`);

  // Run cleanup before retrieving
  cleanupExpiredDocuments();

  const pendingDoc = pendingDocuments.get(userID);

  if (!pendingDoc) {
    console.log(`No pending document found for user ${userID}.`);
    // It's okay if no document is pending, return null
    return NextResponse.json({ pendingDocument: null });
  }

  // Document found, remove it after retrieval (one-time fetch)
  console.log(`Found pending document ${pendingDoc.documentID} for user ${userID}. Removing from store.`);
  pendingDocuments.delete(userID);

  // Return the document details
  return NextResponse.json({
    pendingDocument: {
      documentID: pendingDoc.documentID,
      text: pendingDoc.text, // Include text if it exists
    }
  });
}