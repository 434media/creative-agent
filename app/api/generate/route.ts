//i put the instuctions to make a poster for an event here 

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        prompt: `Create an event poster with the following details: ${prompt}`,
        n: 1,
      size: "512x512",
    }),
  })

  const data = await response.json()

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 500 })
  }

  const imageUrl = data.data[0].url
  return NextResponse.json({ url: imageUrl })
}
