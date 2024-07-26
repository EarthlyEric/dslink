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
  const [alerts, setAlerts] = useState<Array<{ id: number; message: string; type: string }>>([]);

  useEffect(() => {
    const savedUrlPairs = localStorage.getItem('urlPairs');
    if (savedUrlPairs) {
      setUrlPairs(JSON.parse(savedUrlPairs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('urlPairs', JSON.stringify(urlPairs));
  }, [urlPairs]);

  const addAlert = (message: string, type: 'info' | 'success' | 'warning' | 'danger') => {
    const newAlert = { id: Date.now(), message, type };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

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
      addAlert('Invalid URL', 'warning');
      return;
    }

    try {
      const response = await fetch(apiEndpoint + '/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          expirydays: expirydays,
          anonymous: true,
        }, {mode:'cors'}),
      });

      if (response.ok) {
        const data = await response.json();
        const newShortenedUrl = `${apiEndpoint}/${data.hash}`;
        const newUrlPair = { originalUrl: url, shortenedUrl: newShortenedUrl, expiryDays: data.expiryDays };
        setUrlPairs((prevPairs) => [newUrlPair, ...prevPairs]);
        setUrl('');
        addAlert('URL shortened successfully', 'success');
      } else {
        addAlert('An error occurred while shortening the URL', 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      addAlert('An error occurred while shortening the URL', 'danger');
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
      addAlert('URL copied to clipboard', 'info');
    } catch (error) {
      console.error('Failed to copy the URL', error);
      addAlert('Failed to copy the URL', 'danger');
    }
  };

  const handleClearUrls = () => {
    if (urlPairs.length === 0) {
      addAlert('No URLs to clear', 'warning');
      return;
    }
    setUrlPairs([]);
    localStorage.removeItem('urlPairs');
    addAlert('URLs cleared successfully', 'success');
  };

  return (
    <main className="min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 grid grid-cols-1 mx-10 rounded-lg border-4">
      <div className="flex justify-center">
        <h1 className="text-5xl font-bold italic">Welcome to DSLink !</h1>
      </div>
      <div className="flex justify-center">
        <h2 className="text-sm non-italic">It is a simple tool to shorten URL for free</h2>
      </div>
      <div className="fixed bottom-4 left-4 transform -translate-x-1/2 space-y-4">
        <TransitionGroup>
          {alerts.map((alert) => (
            <CSSTransition key={alert.id} timeout={250} classNames="alert">
              <Alert
                message={alert.message}
                type={alert.type as 'info' | 'success' | 'warning' | 'danger'}
                onClose={() => removeAlert(alert.id)}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
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
          Clear URLs
        </button>
      </div>
      <div className="mt-4">
        {urlPairs.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-white">Shortened URLs</h3>
            <ul className="mt-2 space-y-2">
              {urlPairs.map((pair, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md shadow">
                  <div className="flex flex-col">
                    <span className="text-gray-900">{pair.originalUrl}</span>
                    <span className="text-indigo-600">{pair.shortenedUrl}</span>
                  </div>
                  <button
                    onClick={() => handleCopyClick(pair.shortenedUrl)}
                    className="ml-4 text-indigo-600 hover:text-indigo-800"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
