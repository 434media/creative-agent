import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = "1024x1024" } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const dallePrompt = `Design a single, flat, digital event poster based on the following theme: ${prompt}. 
    Use clean illustration style, bold visual layout, and balanced composition. 
    Make it look like a final poster design ready to be printed.`;


    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: dallePrompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024", // e.g., "1024x1024"
        response_format: "url",
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const urls = data.data?.map((img: any) => img.url);
    return NextResponse.json({ urls });
  } catch (err: any) {
    console.error("Unhandled error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
