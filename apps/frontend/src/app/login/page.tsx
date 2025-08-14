"use client";

import { logIn } from "@/services/auth/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase"; // Firebase初期化ファイルからauthをインポート

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await logIn(email, password);
      alert("ログイン成功");
      router.push("/");
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert(
        "パスワード再設定リンクを送るにはメールアドレスを入力してください。"
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("パスワード再設定用のメールを送信しました。");
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
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
          ログイン
        </h1>
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
          onClick={handleLogin}
        >
          ログイン
        </button>
        <button
          className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition duration-300 mb-3"
          onClick={handlePasswordReset}
        >
          パスワードを忘れた方はこちら
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
