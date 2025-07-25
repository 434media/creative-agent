import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = JSON.parse(req.body)

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    const data = await response.json()
    res.status(200).json({ url: data.data[0].url })
  } catch (error) {
    console.error('Error generating image:', error)
    res.status(500).json({ error: 'Failed to generate image' })
  }
}