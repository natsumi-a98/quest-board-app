"use client";

import React from "react";
import UserProfile from "../organisms/UserProfile";
import QuestHistory from "../organisms/QuestHistory";
import NotificationList from "../organisms/NotificationList";

// MyPage用のモックデータ（後でAPIやシードデータに置き換え）
import {
  mockUser,
  mockQuestData,
  mockNotifications,
} from "@/mocks/mockMyPageData";

const MyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 px-6 py-10">
      <section className="max-w-4xl mx-auto space-y-10">
        {/* ユーザー情報 */}
        <UserProfile user={mockUser} />

        {/* 参加中・完了済み・応募済みクエスト */}
        <QuestHistory questData={mockQuestData} />

        {/* 通知メッセージ */}
        <NotificationList notifications={mockNotifications} />
      </section>
    </main>
  );
};

export default MyPage;
