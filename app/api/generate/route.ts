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
Use bold serif typography resembling TexGyreThermes.
Should be fun themes like a scrapbook, with a simple and clean layout.`,
      },
      devsa: {
        name: "DEVSA",
        stylePrompt: `Use a modern, tech-inspired design.`,
      },
    };

    const brand = brandMap[type] || {
      name: "Generic Event",
      stylePrompt: "",
    };

    const dallePrompt = `
Design a single, flat, digital event poster based on the following brand theme: "${brand.name}".
Use clean illustration style, bold visual layout, and balanced composition.
Make it look like a final poster design ready to be printed.
Theme: ${prompt}
Style guidelines: ${brand.stylePrompt}
`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

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

    const urls = data.data?.map((img: { url: string }) => img.url);

    // Caption generation
    const captionPrompt = `You are a creative event copywriter. Write an engaging caption for a poster based on this prompt:\n\n"${prompt}". Be sure to include the date and location of the event along with the event title. 
    The format should be
    
    Title:
    Content:
    Date:
    Location:`;

    const captionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a creative event copywriter." },
          { role: "user", content: captionPrompt },
        ],
        max_tokens: 100,
      }),
    });

    const captionData = await captionResponse.json();

    if (captionData.error) {
      console.error("Caption generation error:", captionData.error);
      return NextResponse.json({ error: captionData.error.message }, { status: 500 });
    }

    const caption = captionData.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ urls, caption });

  } catch (err: unknown) {
    console.error("Unhandled error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
