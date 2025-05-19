import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const VOICEFLOW_API_KEY = process.env.VOICEFLOW_API_KEY;
const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID;
const VERSION_ID = process.env.VOICEFLOW_VERSION_ID || 'production';

/**
 * API route handler to save Voiceflow conversation transcripts
 * This uses Voiceflow's Create Transcript API: https://docs.voiceflow.com/reference/api-guide-saving-transcripts
 * 
 * Required request body:
 * - sessionID: The user's session ID for the conversation to save
 */
export async function PUT(req: NextRequest) {
  // Debug current environment variables
  console.log("DEBUG - Environment Variables:");
  console.log("VOICEFLOW_API_KEY exists:", !!VOICEFLOW_API_KEY);
  console.log("VOICEFLOW_PROJECT_ID:", PROJECT_ID || "not set");
  console.log("VOICEFLOW_VERSION_ID:", VERSION_ID);
  
  // For testing/development, we'll allow hardcoded values if env vars are missing
  const apiKey = VOICEFLOW_API_KEY || "YOUR_TEMP_API_KEY";
  const projectId = PROJECT_ID || "TEMP_PROJECT_ID_FOR_TESTING";
  
  // Verify API key is available
  if (!VOICEFLOW_API_KEY) {
    console.error("VOICEFLOW_API_KEY environment variable is not set.");
    console.warn("Using fallback/test mode with limited functionality");
  }

  // Verify project ID is available
  if (!PROJECT_ID) {
    console.error("VOICEFLOW_PROJECT_ID environment variable is not set.");
    console.warn("Using fallback/test mode with limited functionality");
  }

  try {
    const body = await req.json();
    const { sessionID } = body;

    // Validate session ID
    if (!sessionID) {
      return NextResponse.json({ error: "Missing required parameter: sessionID" }, { status: 400 });
    }

    console.log(`Saving Voiceflow transcript for session: ${sessionID}`);

    // Make request to Voiceflow transcripts API
    const url = "https://api.voiceflow.com/v2/transcripts";
    
    const payload = {
      projectID: projectId, // Use our fallback variable
      versionID: VERSION_ID,
      sessionID: sessionID
    };
    
    // Fix the TypeScript error by ensuring Authorization is never undefined
    const options = {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': apiKey // Use our fallback variable
      },
      body: JSON.stringify(payload)
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error saving transcript for session ${sessionID}: Status ${response.status}, Body: ${errorText}`);
      return NextResponse.json(
        { error: `Voiceflow API error: ${response.statusText}`, details: errorText }, 
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`Successfully saved transcript for session ${sessionID}`, result);
    
    return NextResponse.json({ success: true, transcript: result }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Internal server error in transcripts route:', errorMessage);
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
} 