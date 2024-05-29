'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faCopy } from '@fortawesome/free-solid-svg-icons';
import { apiEndpoint } from './config';

interface UrlPair {
  originalUrl: string;
  shortenedUrl: string;
  expiryDays: number;
}

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [expirydays, setExpirydays] = useState<number>(1);
  const [urlPairs, setUrlPairs] = useState<UrlPair[]>([]);

  useEffect(() => {
    const savedUrlPairs = localStorage.getItem('urlPairs');
    if (savedUrlPairs) {
      setUrlPairs(JSON.parse(savedUrlPairs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('urlPairs', JSON.stringify(urlPairs));
  }, [urlPairs]);

  const handleShortenClick = async () => {
    try {
      const response = await fetch(apiEndpoint + '/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          expirydays: expirydays,
          anonymous: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newShortenedUrl = `${apiEndpoint}/${data.hash}`;
        const expiryDays = data.expiryDays;
        const newUrlPair = { originalUrl: url, shortenedUrl: newShortenedUrl, expiryDays: expiryDays };
        setUrlPairs(prevPairs => [newUrlPair, ...prevPairs]); // Add new URL pair to the beginning of the array
        setUrl('');
      } else {
        console.error('Failed to shorten URL');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleExpirydaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExpirydays(Number(e.target.value));
  };

  const handleCopyClick = async (shortenedUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      alert('Shortened URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy the URL', error);
    }
  };

  return (
    <div className="min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 grid grid-cols-1 mx-10 rounded-lg border-4">
      <div className="flex justify-center">
        <h1 className="text-5xl font-bold italic">Welcome to DSLink !</h1>
      </div>
      <div className="flex justify-center">
        <h2 className="text-sm non-italic">It is a simple tool to shorten URL for free</h2>
      </div>
      <div className="mt-4 flex items-center">
        <label htmlFor="url" className="block text-sm font-medium leading-6 text-white mr-2">
          URL
        </label>
        <input
          type="text"
          name="url"
          id="url"
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
          className="block w-full rounded-md border-4 border-indigo-500 py-1.5 pl-5 pr-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mr-2"
        />
      </div>
      <div className="mt-4 flex items-center">
        <label htmlFor="expirydays" className="block text-sm font-medium leading-6 text-white mr-2">
          Expiration Date
        </label>
        <input
          type="range"
          name="expirydays"
          id="expirydays"
          min="1"
          max="30"
          value={expirydays}
          onChange={handleExpirydaysChange}
          className="mr-2"
        />
        <span className="text-white">{expirydays} days</span>
      </div>
      <div className="mt-4 flex items-center">
        <button
          onClick={handleShortenClick}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Shorten
        </button>
      </div>
      {urlPairs.length > 0 && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium">Shortened URLs:</h3>
          <ul className="space-y-4">
            {urlPairs.map((urlPair, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md border-4 border-indigo-500 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-gray-700 font-semibold">Original URL:</span>
                  <a href={urlPair.originalUrl} className="text-blue-500 break-words">{urlPair.originalUrl}</a>
                </div>
                <span className="text-black mt-2">
                  <FontAwesomeIcon icon={faArrowDown} />
                </span>
                <div className="flex flex-col items-center mt-2">
                  <span className="text-gray-700 font-semibold">Shortened URL:</span>
                  <a href={urlPair.shortenedUrl} className="text-blue-500 break-words">{urlPair.shortenedUrl}</a>
                  <button
                    onClick={() => handleCopyClick(urlPair.shortenedUrl)}
                    className="mt-2 px-2 py-1 text-sm font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                <span className="text-gray-700 mt-2">Expire after: {urlPair.expiryDays} days</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
