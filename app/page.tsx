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
    <div>
      <motion.div
        whileHover={{ scale: 1.15 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-800 p-4 rounded"
>
       
        </motion.div>

      <h1 className="text-3xl font-bold text-center mb-6">
        🚨 Phantom Ledger X Dashboard
      </h1>

       {/* Button */}
      <button onClick={login}>Simulate Attack</button>

    {/* 🔍 LOADING GOES HERE */}
    {loading && (
      <p className="text-center text-yellow-400">
        🔍 Analyzing attack...
      </p>
    )}

      <div className="text-center mb-6">
        <button
          onClick={login}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Simulate Attack
        </button>
      </div>

      {data && data.type && (
        <div className="grid grid-cols-2 gap-6">

          {/* Attack */}
          <div className="bg-slate-800 p-4 rounded">
            <h2 className="text-xl font-bold">⚠️ Attack Detected</h2>
            <p>Type: {data.type}</p>
            <p>Risk: {data.risk}</p>
            <p>Time: {data.time}</p>
          </div>

          {/* Profile */}
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-bold">🧬 Attacker Profile</h3>
            <p>IP: {data.ip}</p>
            <p>Location: {data.location}</p>
            <p>Behavior: {data.dna?.behavior}</p>
            <p>Pattern: {data.dna?.pattern}</p>
            <p>Risk Score: {data.dna?.risk_score}</p>
          </div>

          {/* Timeline */}
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-bold">📊 Timeline</h3>
            <p>• Login attempt</p>
            <p>• Multiple failures</p>
            <p>• Attack detected</p>
            <p>• Evidence secured</p>
          </div>

          {/* Blockchain */}
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-bold">🔐 Blockchain</h3>
            <p>{data.hash}</p>
            <p>Threat shared across nodes</p>
          </div>

        </div>
      )}
    </div>
  );
}