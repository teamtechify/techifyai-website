// app/api/cal/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = process.env.CAL_API_KEY ?? 'cal_live_4b1b1e8d0399ef03ff69b5fbcc5e7c54';
  const defaultEventTypeId = process.env.CAL_EVENT_TYPE_ID ?? '2269133';

  const { searchParams } = new URL(req.url);

  const eventTypeId = searchParams.get("eventTypeId") ?? defaultEventTypeId;
  let startTime = searchParams.get("startTime");
  let endTime = searchParams.get("endTime");
  const timeZone = searchParams.get("timeZone");
  const eventTypeSlug = searchParams.get("eventTypeSlug");
  const orgSlug = searchParams.get("orgSlug");
  const isTeamEvent = searchParams.get("isTeamEvent");
  const usernameList = searchParams.getAll("usernameList");

  // Generate default startTime and endTime if not provided
  const now = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(now.getDate() + 1);

  if (!startTime) startTime = now.toString();
  if (!endTime) endTime = oneWeekLater.toString();

  const query = new URLSearchParams({
    apiKey,
    eventTypeId,
    startTime,
    endTime,
    ...(timeZone && { timeZone }),
    ...(eventTypeSlug && { eventTypeSlug }),
    ...(orgSlug && { orgSlug }),
    ...(isTeamEvent && { isTeamEvent }),
  });

  usernameList.forEach(username => query.append("usernameList", username));

  const url = `https://api.cal.com/v1/slots?${query.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slots', details: error }, { status: 500 });
  }
}
