"use client"
import "nprogress/nprogress.css"


import { useState } from "react"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [posterType, setPosterType] = useState("event");


  const handleSubmit = async () => {
    setIsLoading(true);
    setProgress(0);
  
    //  loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // stop at 95% 
        return prev + 5; // increment by 5% every 100ms this is not acciturate but gives a good visual effect
      });
    }, 100);
  
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImageUrls(data.urls || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      clearInterval(interval);
      setProgress(100); // force complete
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0); // reset for next run
      }, 500); // short delay to show full bar before hiding
    }
  };
  

  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">434 Media Poster Gen</h1>
      <input
        className="border p-2 w-full mb-4 rounded"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />
      <button
        onClick={handleSubmit}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Create
      </button>


    {/*Drop down menu */ }
      <div className="mt-6 text-left"> 
  <label className="block mb-1 font-semibold text-sm text-gray-700"> 
    What brand of poster is this for?
  </label>
  <select
    value={posterType}
    onChange={(e) => setPosterType(e.target.value)}
    className="border p-2 rounded w-full"
  >
    <option value="event">Vemos Vamos</option>
    <option value="concert">DEVSA</option>
    <option value="academic">TEXMEX</option>
    <option value="political">434Media</option>
  </select>
</div>

      {isLoading && (
  <div className="mt-4 w-full h-2 bg-pink-300 rounded overflow-hidden">
    <div
      className="h-full bg-pink-600 transition-all duration-100"
      style={{ width: `${progress}%` }}
    />
  </div>
)}

      {imageUrls.length === 0 && (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-64 bg-[rgba(233,187,210,0.8)] rounded animate-pulse border"
      >
        <p className="text-sm text-gray-500 p-2">Let the AI Magic Begin MEhehe</p>
      </div>
    ))}
  </div>
)}
      

      {imageUrls.length > 0 && (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    {imageUrls.map((url, index) => (
      <div key={index}>
        <p className="text-sm text-gray-600">Option {index + 1}</p>
        <img
          src={url}
          alt={`Generated AI ${index + 1}`}
          className="rounded shadow-lg border"
          onError={(e) => {
            console.error("Image load failed for:", url);
            (e.target as HTMLImageElement).src = "https://placekitten.com/400/400"; //fallback if there are no loading images
          }}
        />
      </div>
    ))}
  </div>
)}

      
    </main>
  )
}
