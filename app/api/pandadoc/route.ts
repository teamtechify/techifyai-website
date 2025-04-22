import { NextRequest, NextResponse } from 'next/server';

const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;

export async function GET(req: NextRequest) {
  // Check if the API key is loaded from environment variables
  if (!PANDADOC_API_KEY) {
    console.error("PANDADOC_API_KEY environment variable is not set.");
    return NextResponse.json({ error: "Server configuration error: PandaDoc API Key missing." }, { status: 500 });
  }

  const documentId = req.nextUrl.searchParams.get("documentId");
  if (!documentId) return NextResponse.json({ error: "Missing documentId" }, { status: 400 });

  try {
    const downloadRes = await fetch(`https://api.pandadoc.com/public/v1/documents/${documentId}/download`, {
      method: 'GET',
      headers: {
        Authorization: `API-Key ${PANDADOC_API_KEY}`,
        Accept: 'application/pdf',
      }
    });

    if (!downloadRes.ok) {
      const errorText = await downloadRes.text();
      return NextResponse.json({ error: errorText }, { status: downloadRes.status });
    }

    const blob = await downloadRes.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch PDF", details: error }, { status: 500 });
  }
}