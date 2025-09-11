"use client";

import React, { useEffect, useState } from "react";
import UserProfile from "../organisms/UserProfile";
import QuestHistory from "../organisms/QuestHistory";
import NotificationList from "../organisms/NotificationList";

type QuestData = {
  participating: any[];
  completed: any[];
  applied: any[];
};

const MyPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [quests, setQuests] = useState<QuestData>({
    participating: [],
    completed: [],
    applied: [],
  });
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // -------------------------------
    // デバッグ用: バックエンドの生レスポンス確認
    // -------------------------------
    fetch("http://localhost:3001/api/mypage/entries", {
      credentials: "include",
    })
      .then(async (res) => {
        const text = await res.text(); // まず文字列で受け取る
        console.log("🟢 [Debug] Raw response from /mypage/entries:", text); // 生レスポンス確認
        try {
          const data = JSON.parse(text); // JSON に変換できるか確認
          console.log("🟢 [Debug] Parsed JSON:", data);
          setQuests(data); // 問題なければ状態にセット
        } catch (err) {
          console.error("🔴 [Debug] JSON parse error:", err);
        }
      });
    // -------------------------------
    // 既存のユーザー情報取得
    fetch("http://localhost:3001/api/mypage/user", {
      credentials: "include", // Cookieベースの認証が必要なら追加
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    // 既存の通知一覧取得
    fetch("http://localhost:3001/api/mypage/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 px-6 py-10">
      <section className="max-w-4xl mx-auto space-y-10">
        {/* ユーザー情報 */}
        {user && <UserProfile user={user} />}

        {/* 参加中・完了済みクエスト */}
        <QuestHistory questData={quests} />

        {/* 通知メッセージ */}
        <NotificationList notifications={notifications} />
      </section>
    </main>
  );
};

export default MyPage;
