"use client"
import "nprogress/nprogress.css"


import { useState } from "react"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const [image, setImage] = useState<string | null>(null);

  const posterConfig = {
    vemosvamos: {
      label: "Vemos Vamos",
    },
    devsa: {
      label: "DEVSA",
    }
  };
  
  const brandKeys = Object.keys(posterConfig);
  const [posterType, setPosterType] = useState(brandKeys[0]); 

   
  const handleSubmit = async () => {
    setIsLoading(true);
    setImage(null);
  
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: posterType, size: "1024x1792",
            }),
      });
  
      const data = await res.json();
      setImage(data.urls?.[0] || null);
    } catch (err) {
      console.error("Image generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-blue-600">

    <main className="p-6 max-w-xl mx-auto text-center text-white">
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
    <select
  value={posterType}
  onChange={(e) => setPosterType(e.target.value)}
  className="border p-2 rounded w-full"
>
  {Object.entries(posterConfig).map(([key, config]) => (
    <option key={key} value={key}>
      {config.label}
    </option>
  ))}
</select>


      {isLoading && (
  <div className="mt-4 w-full h-2 bg-pink-300 rounded overflow-hidden">
    <div
      className="h-full bg-pink-600 transition-all duration-100"
      style={{ width: `${progress}%` }}
    />
  </div>
)}
    <div className="mt-10 flex flex-col items-center justify-center">
  <div className="w-full max-w-2xl min-h-[512px] border-2 border-dashed border-white rounded flex items-center justify-center bg-white/10">
    {image ? (
      <img
        src={image}
        alt="Generated poster"
        className="w-full h-auto rounded shadow-lg"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://placekitten.com/512/512";
        }}
      />
    ) : (
      <p className="text-white text-sm opacity-50">Your generated poster will appear here.</p>
    )}
  </div>

  {/* Text box below the image or placeholder */}
  <div className="w-full max-w-2xl mt-6">
    <label className="block mb-2 text-sm font-medium text-white text-left">
      Notes or Description:
    </label>
    <textarea
      className="w-full p-3 rounded border bg-white text-black resize-none h-32"
      placeholder="Add your caption, notes, or poster description here..."
    />
  </div>
</div>


      

      {imageUrls.length > 0 && (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    {imageUrls.map((url, index) => (
      <div key={index}>
        <p className="text-sm text-white-600">Option {index + 1}</p>
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

    </div>
  )
}
