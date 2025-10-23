"use client";

import { signUp } from "@/services/auth/signUp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="bg-[#fef3c7] border-2 border-[#fbbf24] rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1e3a8a]">
          新規登録
        </h1>

        {/* 名前 */}
        <input
          className="w-full bg-white border border-gray-400 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-black"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* メールアドレス */}
        <input
          className="w-full bg-white border border-gray-400 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-black"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* パスワード */}
        <div className="relative mb-6">
          <input
            className="w-full bg-white border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-black pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* アイコン（右端配置） */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

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
