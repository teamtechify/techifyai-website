import { NextRequest, NextResponse } from 'next/server';

// Use the correct environment variable name as defined in the project's .env setup
const PANDA_DOC_API_KEY = process.env.PANDA_DOC_API_KEY;

export async function GET(req: NextRequest) {
  // Check if the API key is loaded from environment variables
  if (!PANDA_DOC_API_KEY) {
    console.error("PANDA_DOC_API_KEY environment variable is not set.");
    return NextResponse.json({ error: "Server configuration error: PandaDoc API Key missing." }, { status: 500 });
  }

  const documentId = req.nextUrl.searchParams.get("documentId");
  if (!documentId) {
    console.error("Missing documentId parameter in request.");
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  // Check if this request should force download attachment
  const downloadMode = req.nextUrl.searchParams.get("download") === "true";

  try {
    console.log(`Fetching PandaDoc document: ${documentId}`);
    const downloadRes = await fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}/download`, {
      method: 'GET',
      headers: {
        Authorization: `API-Key ${PANDA_DOC_API_KEY}`,
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

    // Get filename from Content-Disposition header if available
    let filename = `document-${documentId}.pdf`;
    const contentDisposition = downloadRes.headers.get('Content-Disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Set the appropriate Content-Disposition based on request mode
    const disposition = downloadMode ? 'attachment' : 'inline';

    // Return PDF with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        // Add cache control headers to prevent caching issues
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Unexpected error fetching PandaDoc PDF for document ${documentId}:`, errorMessage);
    return NextResponse.json({ error: "Failed to fetch PDF due to an internal server error.", details: errorMessage }, { status: 500 });
  }
}