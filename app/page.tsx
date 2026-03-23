"use client";
<<<<<<< HEAD

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [attempts, setAttempts] = useState(0);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
  // ❗ Step 1: Check empty input
  if (!password || password.trim() === "") {
    alert("⚠️ Please enter a password");
    return; // stop execution
  }

  // ❗ Step 2: Wrong password logic
  if (password !== "admin") {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= 3) {
      alert("🚨 Suspicious activity detected!");
      router.push("/dashboard");
    }
  } else {
    alert("Login success");
  }
};

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-2xl mb-4">🔐 Secure Login</h1>

      <input
        type="password"
        placeholder="Enter password"
        className="p-2 text-black mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Login
      </button>

      <p className="mt-4">Attempts: {attempts}</p>
    </div>
=======
import { useState, useEffect } from "react";

export default function Home() {
  const [logInput, setLogInput] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState([]);

  // 1. Fetch Trapped Threats from MongoDB
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (Array.isArray(data)) {
        setIncidents(data);
      }
    } catch (err) {
      console.error("Failed to load history feed.");
    }
  };

  // 2. Initial Load
  useEffect(() => {
    fetchHistory();
  }, []);

  // 3. Execute Forensic Scan
  const handleScan = async () => {
    if (!logInput) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ logData: logInput }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setAnalysis(data);
      
      // REFRESH THE FEED IMMEDIATELY AFTER A HIT
      fetchHistory(); 
    } catch (err) {
      console.error("Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-red-600 italic">PHANTOM LEDGER X</h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-mono">Forensic Threat Sealing Engine // v2.0.26</p>
          </div>
          <div className="text-right">
            <div className={`text-xs font-mono px-3 py-1 rounded-full border ${incidents.length > 0 ? 'border-red-500 text-red-500 animate-pulse' : 'border-green-500 text-green-500'}`}>
              {incidents.length > 0 ? '● THREATS DETECTED' : '● SYSTEM SECURE'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: SCANNER INPUT */}
          <section className="space-y-6">
            <div className="p-1 bg-gradient-to-br from-red-900/50 to-transparent rounded-2xl">
              <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5">
                <label className="block text-xs font-mono text-gray-400 mb-4 uppercase tracking-widest">Input Raw Log Data</label>
                <textarea 
                  className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-red-100 focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-800"
                  placeholder="Paste suspicious traffic, SQL queries, or scripts here..."
                  value={logInput}
                  onChange={(e) => setLogInput(e.target.value)}
                />
                <button 
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full mt-4 bg-red-700 hover:bg-red-600 disabled:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-[0.98]"
                >
                  {loading ? "SEALING EVIDENCE..." : "EXECUTE FORENSIC SCAN"}
                </button>
              </div>
            </div>

            {analysis && (
              <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-red-500 font-mono text-xs uppercase mb-4 tracking-tighter">Analysis Result</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase">Threat Type</p>
                    <p className="font-bold">{analysis.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase">Risk Level</p>
                    <p className={`font-bold ${parseInt(analysis.risk) > 70 ? 'text-red-500' : 'text-yellow-500'}`}>{analysis.risk}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-gray-500 text-[10px] uppercase font-mono truncate">Digital Hash: {analysis.hash}</p>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: LIVE INCIDENT FEED */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-mono text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> Live Incident Feed
            </h2>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {incidents.map((item: any, i) => (
                <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-xl hover:border-red-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-300">{item.type}</span>
                    <span className="text-[10px] font-mono text-gray-600">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3 line-clamp-1 italic font-mono">"{item.raw_input || item.attacker_input}"</p>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-red-500/70">{item.hash?.substring(0, 14)}...</span>
                    <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">{item.risk}</span>
                  </div>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-700 font-mono text-xs uppercase tracking-widest">No Breach Evidence Recorded</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
>>>>>>> 8d604ff3423f8fb28adf88cc5e824d6d9d9eaa02
  );
}