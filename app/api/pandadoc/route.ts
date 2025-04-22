import { NextRequest, NextResponse } from 'next/server';

// Use the correct environment variable name as defined in the project's .env setup
const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;

export async function GET(req: NextRequest) {
  // Check if the API key is loaded from environment variables
  if (!PANDADOC_API_KEY) {
    console.error("PANDADOC_API_KEY environment variable is not set.");
    return NextResponse.json({ error: "Server configuration error: PandaDoc API Key missing." }, { status: 500 });
  }

  const documentId = req.nextUrl.searchParams.get("documentId");
  if (!documentId) {
    console.error("Missing documentId parameter in request.");
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  try {
    console.log(`Fetching PandaDoc document: ${documentId}`);
    const downloadRes = await fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}/download`, {
      method: 'GET',
      headers: {
        Authorization: `API-Key ${PANDADOC_API_KEY}`,
        Accept: 'application/pdf',
      }
    });

    if (!downloadRes.ok) {
      const errorText = await downloadRes.text();
      console.error(`PandaDoc API error for document ${documentId}: Status ${downloadRes.status}, Body: ${errorText}`);
      // Return a more generic error to the client, but log the details
      return NextResponse.json({ error: `Failed to retrieve document (Status: ${downloadRes.status})` }, { status: downloadRes.status });
    }

    console.log(`Successfully fetched document ${documentId}. Preparing response.`);
    const blob = await downloadRes.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Return PDF with appropriate headers for inline display
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline', // Suggests browser displays inline if possible
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Unexpected error fetching PandaDoc PDF for document ${documentId}:`, errorMessage);
    return NextResponse.json({ error: "Failed to fetch PDF due to an internal server error.", details: errorMessage }, { status: 500 });
  }
}