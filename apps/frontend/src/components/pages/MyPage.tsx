"use client";

import React, { useEffect, useState } from "react";
import UserProfile from "../organisms/UserProfile";
import QuestHistory from "../organisms/QuestHistory";
import NotificationList from "../organisms/NotificationList";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user";
import { authenticatedHttpRequest } from "@/services/httpClient";
import { questService } from "@/services/quest";
import type { Quest as FullQuest } from "@/types/quest";

type QuestData = {
  participating: any[];
  completed: any[];
  applied: any[];
};

type FullQuestData = {
  participating: FullQuest[];
  completed: FullQuest[];
  applied: FullQuest[];
};

const MyPage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [quests, setQuests] = useState<QuestData>({
    participating: [],
    completed: [],
    applied: [],
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [fullQuests, setFullQuests] = useState<FullQuestData>({
    participating: [],
    completed: [],
    applied: [],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 認証ユーザーがいる場合のみ、Bearer付きで取得
        const [entries, notificationsJson] = await Promise.all([
          authenticatedHttpRequest<QuestData>({
            method: "GET",
            path: "/mypage/entries",
          }),
          authenticatedHttpRequest<any[]>({
            method: "GET",
            path: "/mypage/notifications",
          }),
        ]);

        if (cancelled) return;

        setQuests(entries || { participating: [], completed: [], applied: [] });

        // 履歴に出すクエストを一覧と同じ詳細カードで表示するために詳細データを取得
        const ids = Array.from(
          new Set([
            ...(entries?.participating || []).map((q: any) => q.id),
            ...(entries?.completed || []).map((q: any) => q.id),
            ...(entries?.applied || []).map((q: any) => q.id),
          ])
        ).filter((id) => typeof id === "number" || typeof id === "string");

        // 一覧と同じ取得元に統一（全件取得→IDで絞り込み）
        const allQuests = await questService.getAllQuests();
        const fetchedList = allQuests.filter((q) => ids.includes(q.id));

        // クエストカードのstatusに基づいて分類
        const participating: FullQuest[] = [];
        const completed: FullQuest[] = [];
        const applied: FullQuest[] = [];

        fetchedList.forEach((quest) => {
          const status = String(quest.status || "").toLowerCase();
          if (status === "active" || status === "in_progress") {
            participating.push(quest);
          } else if (status === "completed") {
            completed.push(quest);
          } else {
            applied.push(quest);
          }
        });

        setFullQuests({
          participating,
          completed,
          applied,
        });
        setNotifications(
          Array.isArray(notificationsJson) ? notificationsJson : []
        );
      } catch (error) {
        console.error("/mypage データ取得に失敗しました", error);
        if (!cancelled) {
          setQuests({ participating: [], completed: [], applied: [] });
          setNotifications([]);
          setFullQuests({ participating: [], completed: [], applied: [] });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 認証ユーザーが確定・変化したらDBユーザーを取得（ヘッダーと同様）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (authUser?.uid) {
          const me = await userService.getCurrentUser();
          if (!cancelled) setUser(me);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("/users/me の取得に失敗しました", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 px-6 py-10">
      <section className="max-w-4xl mx-auto space-y-10">
        {/* ユーザー情報 */}
        {
          // 認証情報を優先して表示（fallbackでバックエンドのユーザー情報を使用）
          (authUser || user) && (
            <UserProfile
              user={{
                // ヘッダーと同様にDBのnameを優先し、次にdisplayName
                name: user?.name || authUser?.displayName || "",
                email: authUser?.email || user?.email || "",
                avatar: (user?.name || authUser?.displayName || "")
                  .slice(0, 1)
                  .toUpperCase(),
              }}
            />
          )
        }

        {/* 参加中・完了済みクエスト（一覧と同じカード情報を使用）*/}
        <QuestHistory questData={fullQuests} />

        {/* 通知メッセージ */}
        <NotificationList notifications={notifications} />
      </section>
    </main>
  );
};

export default MyPage;
