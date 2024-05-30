'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { apiEndpoint } from './config';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './animation.css'; 
import Alert from './components/alert';

interface UrlPair {
  originalUrl: string;
  shortenedUrl: string;
  expiryDays: number;
}

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [expirydays, setExpirydays] = useState<number>(1);
  const [urlPairs, setUrlPairs] = useState<UrlPair[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedUrlPairs = localStorage.getItem('urlPairs');
    if (savedUrlPairs) {
      setUrlPairs(JSON.parse(savedUrlPairs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('urlPairs', JSON.stringify(urlPairs));
  }, [urlPairs]);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleShortenClick = async () => {
    if (!isValidUrl(url)) {
      setErrorMessage('Please enter a valid URL');
      return;
    }

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
        setUrlPairs(prevPairs => [newUrlPair, ...prevPairs]);
        setUrl('');
        setErrorMessage(null);
        setSuccessMessage('Shortened URL copied to clipboard!');
      } else {
        setErrorMessage('Failed to shorten URL');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while shortening the URL');
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
      setSuccessMessage('Shortened URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy the URL', error);
      setErrorMessage('Failed to copy the URL');
    }
  };

  const handleClearUrls = () => {
    setUrlPairs([]);
    localStorage.removeItem('urlPairs');
  };

  const closeErrorMessage = () => setErrorMessage(null);
  const closeSuccessMessage = () => setSuccessMessage(null);

  return (
    <main className="min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 grid grid-cols-1 mx-10 rounded-lg border-4">
      <div className="flex justify-center">
        <h1 className="text-5xl font-bold italic">Welcome to DSLink !</h1>
      </div>
      <div className="flex justify-center">
        <h2 className="text-sm non-italic">It is a simple tool to shorten URL for free</h2>
      </div>
      {errorMessage && <Alert message={errorMessage} type="danger" onClose={closeErrorMessage}/>}
      {successMessage && <Alert message={successMessage} type="success" onClose={closeSuccessMessage} />}
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
          className="rounded-md bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
        >
          Shorten
        </button>
      </div>
      <div className="mt-4 flex items-center">
        <button
          onClick={handleClearUrls}
          className="rounded-md bg-red-600 px-5 py-2.5 text-white hover:bg-red-700"
        >
          Clear All
        </button>
      </div>
      <div className="mt-4 flex items-center">
        <TransitionGroup className="list">
          {urlPairs.map((urlPair, index) => (
            <CSSTransition key={index} timeout={500} classNames="item">
              <div className="flex items-center justify-between w-full bg-white p-4 rounded shadow mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{urlPair.originalUrl}</p>
                  <div className="text-sm text-center text-black">
                    <FontAwesomeIcon icon={faArrowDown} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-800 font-semibold">{urlPair.shortenedUrl}</p>
                  <p className="text-sm text-gray-600">
                    Expires in {urlPair.expiryDays} day{urlPair.expiryDays === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleCopyClick(urlPair.shortenedUrl)}
                    className="text-blue-500 hover:text-blue-700 mx-2"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                  <button
                    onClick={() => setUrlPairs(urlPairs.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 mx-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </main>
  );
}
