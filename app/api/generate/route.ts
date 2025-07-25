import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "default", size = "1024x1792" } = await req.json();

    const brandMap: Record<string, { name: string; stylePrompt: string }> = {
      vemosvamos: {
        name: "Vemos Vamos",
        stylePrompt: `
Use expressive, artistic composition. 
Favor vibrant colors like dark red (#861804) and cream (#ECEADA).
Use bold serif typography resembling TexGyreThermes. Should be fun themes like a scrapbook, with a simple and clean layout`,
      },
      devsa: {
        name: "DEVSA",
        stylePrompt: ` Use a modern, tech-inspired design.`,
      },

    };

    const brand = brandMap[type] || {
      name: "Generic Event",
      stylePrompt: "",
    };

    const dallePrompt = `
        Design one, vertical, digital event poster for the brand "${brand.name}".

        Theme: ${prompt}

        Style guidelines:
        ${brand.stylePrompt}
    `;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    console.log("Received type:", type);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
        
      method: "POST",
      
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: dallePrompt,
        n: 1,
        size,
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
