"use client"

import { useState } from "react"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = async () => {
    console.log("Received prompt:", prompt)

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    console.log("API response:", data)
    setImageUrl(data.url)
  }

  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">AI Photo Generator</h1>
      <input
        className="border p-2 w-full mb-4 rounded"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate
      </button>
      {imageUrl && (
        <img src={imageUrl} alt="Generated AI" className="mt-6 rounded shadow" />
      )}
    </main>
  )
}
