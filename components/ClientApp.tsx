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
    console.log("🔄 useEffect triggered - loading Firebase Auth...");
    loadFirebaseAuth().then(({ auth, onAuthStateChanged }) => {
      console.log("✅ Firebase Auth loaded");
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("👤 User logged in:", user);
        } else {
          console.log("👤 No user logged in");
        }
        setUser(user);
        setFirebaseReady(true);
      });
    }).catch(err => {
      console.error("❌ Failed to load Firebase Auth", err);
    });
  }, []);

  const handleLogin = async () => {
    const { auth, GoogleAuthProvider, signInWithPopup } = await loadFirebaseAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Signed in:", result.user);
    } catch (error) {
      console.error("❌ Sign-in failed:", error);
    }
  };

  const handleLogout = async () => {
    const { auth, signOut } = await loadFirebaseAuth();
    try {
      await signOut(auth);
      setUser(null);
      console.log("🚪 Signed out");
    } catch (error) {
      console.error("❌ Sign-out failed:", error);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email: user?.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Scrape succeeded");
        console.log("📦 Scrape result:", data);
      } else {
        setMessage(data.error || "❌ Scrape failed");
        console.error("❌ Scrape error:", data);
      }
    } catch (err) {
      console.error("❌ Scrape failed:", err);
      setMessage("❌ Scrape failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl w-full space-y-4 p-8">
      {!firebaseReady ? (
        <p>Loading Firebase...</p>
      ) : user ? (
        <>
          <p>👋 Welcome, {user.displayName}</p>
          <input
            className="border w-full p-2 rounded"
            type="text"
            placeholder="Paste product URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            onClick={handleScrape}
            disabled={loading}
          >
            {loading ? "Scraping..." : "Scrape"}
          </button>
          <button
            className="w-full bg-gray-700 text-white py-2 rounded"
            onClick={handleLogout}
          >
            Log out
          </button>
          {message && <p className="text-sm mt-2">{message}</p>}
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