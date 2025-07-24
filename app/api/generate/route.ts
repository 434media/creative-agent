import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    console.log("Received prompt:", prompt)

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("Missing API Key")
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

    console.log("OpenAI status:", response.status)
    console.log("OpenAI response:", JSON.stringify(data, null, 2))

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const imageUrl = data?.data?.[0]?.url
    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL returned." }, { status: 500 })
    }

    return NextResponse.json({ url: imageUrl })

  } catch (err: any) {
    console.error("Unhandled error:", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}

