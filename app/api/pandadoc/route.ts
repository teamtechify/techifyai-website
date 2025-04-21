import { NextRequest, NextResponse } from 'next/server';

const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY ?? 'df39615846fc8ecbdc3e61171cadb09886ffa95e';

export async function GET(req: NextRequest) {
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
