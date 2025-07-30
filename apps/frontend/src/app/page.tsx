"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import Link from "next/link";

export default function RootPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        router.replace("/home");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth || isLoggedIn) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">ようこそ クエスト掲示板 へ</h1>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ログイン
        </Link>
        <Link
          href="/signUp"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}
