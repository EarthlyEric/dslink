'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleShortenClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:443/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          anonymous: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setShortenedUrl(`http://127.0.0.1:443/${data.hash}`);
      } else {
        console.error('Failed to shorten URL');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 grid grid-cols-1 mx-10 rounded-lg border-2">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold italic">Welcome to DSLink !</h1>
      </div>
      <div className="flex justify-center">
        <h2 className="non-italic">It is a simple tool to shorten URL for free</h2>
      </div>
      <div>
        <label htmlFor="URL" className="block text-sm font-medium leading-6 text-white">
          URL
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="url"
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={handleShortenClick}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Shorten
            </button>
          </div>
        </div>
      </div>
      {shortenedUrl && (
        <div className="mt-4 text-center">
          <p>Shortened URL: <a href={shortenedUrl} className="text-blue-500">{shortenedUrl}</a></p>
        </div>
      )}
    </div>
  );
}
