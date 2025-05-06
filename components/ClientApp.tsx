"use client";

import React, { useEffect, useState } from "react";
import { loadFirebaseAuth } from "../lib/loadFirebase";

export default function ClientApp() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFirebaseAuth().then(({ auth, onAuthStateChanged }) => {
      onAuthStateChanged(auth, (user) => {
        setUser(user);
        setFirebaseReady(true);
      });
    });
  }, []);

  const handleLogin = async () => {
    const { auth, GoogleAuthProvider, signInWithPopup } = await loadFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    const { auth, signOut } = await loadFirebaseAuth();
    await signOut(auth);
    setUser(null);
  };

  const handleScrape = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Data successfully scraped and exported to your Google Sheet.");
      } else {
        setMessage(data.error || "❌ An error occurred.");
      }
    } catch (err) {
      setMessage("❌ Failed to scrape. Please try again.");
    }
    setLoading(false);
  };

  if (!firebaseReady) {
    return <p className="text-center text-gray-500 mt-6">Connecting to Firebase…</p>;
  }

  return (
    <div className="w-full max-w-xl space-y-4 p-8">
      {!user ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <p className="mb-2 text-sm text-gray-600">Welcome, {user.displayName}</p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product URL..."
            className="w-full border px-4 py-2 rounded"
          />
          <button
            onClick={handleScrape}
            disabled={!url || loading}
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Scraping..." : "Go"}
          </button>
          {message && <p className="mt-4 text-sm text-center">{message}</p>}
          <button
            onClick={handleLogout}
            className="mt-4 text-sm text-gray-500 hover:underline w-full"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}