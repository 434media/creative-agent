import { useState } from "react"


export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
  
    const handleSubmit = async () => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImageUrl(data.url);
    };
  
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">AI Photo Generator</h1>
        <input
          className="border p-2 w-full mb-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image..."
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Generate
        </button>
        {imageUrl && <img src={imageUrl} alt="Generated AI" className="mt-6 rounded shadow" />}
      </div>
    );
  }
  