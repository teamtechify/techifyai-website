// app/api/voiceflow/route.ts

import { NextRequest, NextResponse } from 'next/server';

const APIKEY = process.env.API_KEY || 'VF.DM.67f539ea2bfa1eff8c1a7c41.VKlMMrDZWJX3tYTh';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId = 'guest', actionType = 'launch', payload = '' } = body;

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
        Authorization: APIKEY,
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
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ steps: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
}
