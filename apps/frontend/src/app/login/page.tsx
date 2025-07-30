"use client";

import { logIn } from "@/services/auth/login";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await logIn(email, password);
      alert("ログイン成功");
      router.push("/home"); // 成功時に遷移
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">ログイン</h1>
      <input
        className="border p-2 mb-2 block"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 block"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleLogin}
      >
        ログイン
      </button>
    </main>
  );
}
