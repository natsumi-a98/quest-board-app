"use client";

import { signUp } from "@/services/auth/signUp";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await signUp(name, email, password);
      alert("サインアップ成功");
      router.push("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(`エラー: ${message}`);
    }
  };

  const handleBack = () => {
    router.push("/"); // トップページに戻る
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      {/* 中央カード */}
      <div className="bg-[#fef3c7] border-2 border-[#fbbf24] rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1e3a8a]">
          新規登録
        </h1>
        <input
          className="w-full bg-white border border-gray-400 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full bg-white border border-gray-400 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-white border border-gray-400 p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-[#1e3a8a] text-white py-3 rounded hover:bg-blue-800 transition duration-300 mb-3"
          onClick={handleSignup}
        >
          登録
        </button>
        <button
          className="w-full bg-gray-500 text-white py-3 rounded hover:bg-gray-600 transition duration-300"
          onClick={handleBack}
        >
          戻る
        </button>
      </div>
    </main>
  );
}
