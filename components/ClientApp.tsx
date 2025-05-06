"use client";

import React, { useEffect, useState } from "react";
import { loadFirebaseAuth } from "../lib/loadFirebase";

export default function ClientApp() {
  const [user, setUser] = useState<any>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleUpgrade = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="max-w-xl w-full space-y-4 p-8">
      {!firebaseReady ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <input
            className="border w-full p-2 rounded"
            type="text"
            placeholder="Paste product URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            onClick={() => alert("Fake scrape logic here")}
          >
            Scrape
          </button>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={handleUpgrade}
          >
            Upgrade to Pro
          </button>
          <button
            className="text-sm text-gray-500 hover:underline w-full"
            onClick={handleLogout}
          >
            Log out
          </button>
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </>
      ) : (
        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          onClick={handleLogin}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}