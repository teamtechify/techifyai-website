// app/api/voiceflow/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

// Use the correct environment variable name as defined in the project's .env setup
const VOICEFLOW_API_KEY = process.env.VOICEFLOW_API_KEY;

/**
 * Processes Voiceflow steps to standardize document ID tags.
 * Looks for various potential formats and converts them to <DOCUMENTID>id</DOCUMENTID>.
 * @param {any[]} steps - Array of steps from Voiceflow response.
 * @returns {any[]} Steps with processed messages.
 */
const processDocumentReferences = (steps: any[]) => {
  if (!Array.isArray(steps)) {
    console.warn("processDocumentReferences received non-array steps:", steps);
    return steps; // Return original if not an array
  }

  return steps.map(step => {
    // Check if the step has a message payload
    if ((step.type === "speak" || step.type === "text") && step.payload?.message && typeof step.payload.message === 'string') {
      const message = step.payload.message;

      // Define regex patterns for potential document reference formats (case-insensitive)
      const docIdRegex1 = /<document>(.*?)<\/document>/i; // <document>id</document>
      const docIdRegex2 = /<doc id="(.*?)">/i;           // <doc id="id">
      const docIdRegex3 = /\[document:(.*?)\]/i;        // [document:id]
      // Add more patterns here if needed

      let docId: string | null = null;
      let match: RegExpMatchArray | null;
      let matchedPattern: RegExp | null = null;

      // Try matching each pattern
      if ((match = message.match(docIdRegex1)) && match[1]) {
        docId = match[1].trim();
        matchedPattern = docIdRegex1;
      } else if ((match = message.match(docIdRegex2)) && match[1]) {
        docId = match[1].trim();
        matchedPattern = docIdRegex2;
      } else if ((match = message.match(docIdRegex3)) && match[1]) {
        docId = match[1].trim();
        matchedPattern = docIdRegex3;
      }
      // Add more else if blocks for other patterns

      // If a document ID was found, replace the original tag with the standardized one
      if (docId && matchedPattern) {
        console.log(`Standardizing document reference. Found ID: ${docId} in message: "${message}"`);
        const formattedMessage = message.replace(
          matchedPattern, // Replace the specific pattern that matched
          `<DOCUMENTID>${docId}</DOCUMENTID>` // Standardized tag
        );
        console.log(`Formatted message: "${formattedMessage}"`);
        // Return a new step object with the updated message
        return { ...step, payload: { ...step.payload, message: formattedMessage } };
      }
    }
    // If no document reference found or step type doesn't match, return the original step
    return step;
  });
};


export async function POST(req: NextRequest) {
  // Check if the API key is loaded from environment variables
  if (!VOICEFLOW_API_KEY) {
    console.error("VOICEFLOW_API_KEY environment variable is not set.");
    return NextResponse.json({ error: "Server configuration error: Voiceflow API Key missing." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const userId = body.userId || uuidv4(); // Use provided userId or generate one
    const actionType = body.actionType || 'launch';
    const payload = body.payload || '';

    console.log(`Voiceflow request received for user ${userId}, action: ${actionType}`);

    const url = `https://general-runtime.voiceflow.com/state/user/${userId}/interact?logs=off`;

    const action =
      actionType === 'launch'
        ? { type: 'launch' }
        : { type: 'text', payload };

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: VOICEFLOW_API_KEY, // Use the environment variable
        versionID: 'production' // Or 'development' based on your needs
      },
      body: JSON.stringify({
        action,
        config: {
          tts: false,
          stripSSML: true,
          stopAll: false,
          excludeTypes: ['block', 'debug', 'flow'],
        },
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Voiceflow API error for user ${userId}: Status ${response.status}, Body: ${errorText}`);
      return NextResponse.json({ error: `Voiceflow API error: ${response.statusText}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log(`Voiceflow response received for user ${userId}. Processing steps...`);

    // Process the response steps to standardize document references
    const processedSteps = processDocumentReferences(data);

    console.log(`Processed steps for user ${userId}:`, processedSteps);
    return NextResponse.json({ steps: processedSteps }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Internal server error in Voiceflow route:', errorMessage);
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}