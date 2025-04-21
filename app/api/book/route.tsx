// app/api/book/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.CAL_KEY;
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID;

  if (!apiKey || !eventTypeId) {
    return NextResponse.json({ error: 'Missing CAL_API_KEY or CAL_EVENT_TYPE_ID in environment' }, { status: 500 });
  }

  const body = await req.json();

  const payload = {
    eventTypeId: parseInt(eventTypeId),
    start: body.start, // must be a string like 'Sun Apr 15 2025 14:04:31 GMT-0500 (CDT)'
    timeZone: body.timeZone ?? 'CST',
    language: body.language ?? 'English',
    responses: {
      name: body.name,
      email: body.email,
      location: {
        optionValue: body.locationOption ?? 'House',
        value: body.locationValue ?? 'www.google.com'
      },
    },
    metadata: {
      InterestedServices: body.services ?? 'unspecified'
    }
  };

  try {
    const res = await fetch(`https://api.cal.com/v1/bookings?apiKey=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking', details: error }, { status: 500 });
  }
}
