"use client";

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
  );
}