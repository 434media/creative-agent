
"use client";
import "nprogress/nprogress.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [history, setHistory] = useState<{ url: string; caption: string }[]>([]);

  
  const posterConfig = {
    vemosvamos: { label: "Vemos Vamos" },
    devsa: { label: "DEVSA" },
    texmex: { label: "TexMex" },
  };

  const brandKeys = Object.keys(posterConfig);
  const [posterType, setPosterType] = useState(brandKeys[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? prev : prev + Math.floor(Math.random() * 5) + 1));
      }, 200);
    } else if (!isLoading && progress !== 0) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 800);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const [caption, setCaption] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setImage(null);
    setCaption("");
  
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          type: posterType,
          size: "1024x1024",
        }),
      });
  
      const data = await res.json();
  
      if (!data || !data.urls || !data.caption) {
        throw new Error("Missing data in response");
      }
  
      setImage(data.urls[0]);
      setCaption(data.caption);
  
      setHistory((prev) => [
        { url: data.urls[0], caption: data.caption },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      console.error("Failed to parse image/caption:", err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSave = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "poster.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-blue-600 text-white">
<main className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,800px)_auto] gap-8 p-6 md:max-w-[1600px] mx-auto">

        {/* Prompting Tips */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
  <div className="bg-white/10 border border-white/30 rounded p-4">
    <h3 className="text-lg font-semibold mb-3">Prompting Tips</h3>
    <div className="text-sm space-y-4">

      <div>
        <h4 className="font-bold text-white">General</h4>
        <ul className="list-disc list-inside space-y-1 text-white/80">
          <li>Describe the <b>event or scene</b>, not layout</li>
          <li>Focus on the <b>vibe, subject, or action</b></li>
          <li><b>Don't</b> say “poster” it knows it's a poster</li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white">Vemos Vamos</h4>
        <ul className="list-disc list-inside space-y-1 text-white/80">
          <li>Use scrapbook-friendly ideas: “print fair”, “collage club”</li>
          <li>Include words like: <i>paper cutouts, candid photo</i></li>
          <li><b>Avoid:</b> layout or font instructions</li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white">DEVSA</h4>
        <ul className="list-disc list-inside space-y-1 text-white/80">
          <li>Describe the tech event: “AI meetup”, “student hackathon”</li>
          <li>Use terms like: <i>terminal, code, laptop crowd</i></li>
          <li><b>Don’t add:</b> font, bracket, or UI layout notes</li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white">TexMex Heritage</h4>
        <ul className="list-disc list-inside space-y-1 text-white/80">
          <li>Focus on visual intensity: “boxer mid-swing”, “sparring”</li>
          <li>Lean into texture/motion: <i>gritty, rugged</i></li>
          <li><b>Avoid:</b> typefaces, frames, or poster structure</li>
        </ul>
      </div>
    </div>
  </div>
</aside>


        {/* Main Poster Generation */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-center animate-fade-in-up">434 Media: Poster Creator</h1>

          <div className="border border-white/40 bg-white/10 p-4 rounded mb-6">
            <input
              className="border p-2 w-full mb-4 rounded text-white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create a..."
            />
             {/* Pick your brand label */}
              <label className="block mb-3.5 text-sm text-white font-bold">
            Pick your brand:
            </label>
            <select
            value={posterType}
            onChange={(e) => setPosterType(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-white"
              >
              {Object.entries(posterConfig).map(([key, config]) => (
              <option key={key} value={key}>
              {config.label}
             </option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
            >
              Create
            </button>
            {isLoading && (
              <div className="mt-4 w-full h-2 bg-pink-300 rounded overflow-hidden">
                <div
                  className="h-full bg-pink-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="border border-white/30 bg-white/10 p-4 rounded">
            <div className="w-full max-w-md mx-auto min-h-[300px] border-2 border-dashed border-white rounded flex items-center justify-center bg-white/10 mb-6">
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
                <p className="text-white text-sm opacity-50">Your amazing poster will soon be.</p>
              )}
            </div>
            <textarea
              className="w-full p-3 rounded border text-white resize-none h-24 mb-4"
              value={caption}
              readOnly
              placeholder="Your poster caption will appear here ;) ..."
            />
            <div className="w-full flex gap-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Try Again
              </button>
              <button
                onClick={handleSave}
                disabled={!image}
                className="flex-1 bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* History Section */}
        <aside className="w-full md:w-64">
          <h2 className="text-xl font-semibold mb-4">History</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {history.map((item, index) => (
              <div key={index} className="bg-white/10 rounded p-2">
                <img src={item.url} alt={`Poster ${index + 1}`} className="w-full rounded mb-2" />
                <p className="text-sm opacity-80">{item.caption}</p>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-white/60 text-sm">No posters yet.</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
