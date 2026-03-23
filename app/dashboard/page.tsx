"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: "123" }),
    });

    const result = await res.json();

    setLoading(false);
    setData(result);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen text-white p-6">

      <h1 className="text-4xl font-bold text-center mb-6">
        🚨 Phantom Ledger X Dashboard
      </h1>

      {/* Button */}
      <div className="text-center mb-6">
        <button
          onClick={login}
          className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-2 rounded-xl shadow-md hover:scale-105 transition"
        >
          Simulate Attack
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-yellow-400 mb-4 animate-pulse">
          🔍 Analyzing attack...
        </p>
      )}

      {/* Dashboard */}
      {data && data.type && (
        <div className="grid grid-cols-2 gap-6">

          {/* Attack */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-xl shadow-lg"
          >
            <h2 className="font-bold text-lg">⚠️ Attack Detected</h2>
            <p>Type: {data.type}</p>
            <p className="text-red-400">Risk: {data.risk}</p>
            <p>Time: {data.time}</p>
          </motion.div>

          {/* Profile */}
          <div className="bg-slate-800 p-4 rounded">
          <h2 className="font-bold">🧬 Attacker Profile</h2>
          <p>IP: {data.ip}</p>
          <p>Location: {data.location}</p>
          <p>Behavior: {data.dna?.behavior}</p>
          <p>Pattern: {data.dna?.pattern}</p>
          <p>Risk Score: {data.dna?.risk_score}</p>
        </div>

          <div className="bg-slate-800 p-4 rounded">
          <h2 className="font-bold">📊 Timeline</h2>
          <ul>
            <li>Login attempt</li>
            <li>Multiple failures</li>
            <li>Attack detected</li>
            <li>Evidence secured</li>
          </ul>
        </div>

          <div className="bg-slate-800 p-4 rounded">
          <h2 className="font-bold">🔐 Blockchain Evidence</h2>
          <p className="text-sm break-all">
            {data.hash}
          </p>
          <p className="text-green-400">✔ Stored securely</p>
        </div>

        </div>
      )}
    </div>
  );
}