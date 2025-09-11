"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { Sword, Award, Bell, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ログアウトしました");
      router.push("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(`ログアウトエラー: ${message}`);
    }
  };

  const navItems = [
    {
      id: "quests",
      label: "クエスト一覧",
      icon: <Sword className="w-5 h-5" />,
      href: "/quests",
    },
    {
      id: "mypage",
      label: "マイページ",
      icon: <User className="w-5 h-5" />,
      href: "/mypage",
    },
    {
      id: "rewards",
      label: "報酬交換所",
      icon: <Award className="w-5 h-5" />,
      href: "/rewards",
    },
    {
      id: "dashboard",
      label: "ダッシュボード",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/dashboard",
    },
  ];

  return (
    <>
      {/* 上部ヘッダー */}
      <header className="bg-slate-800 border-b-4 border-yellow-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* ロゴ */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sword className="w-6 h-6 text-slate-800" />
              </div>
              <h1
                className="text-2xl font-bold text-yellow-400"
                style={{ fontFamily: "serif" }}
              >
                Quest Board
              </h1>
            </div>

            {/* 右上メニュー */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">1,250 GP</span>
              </div>
              <Bell className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
              <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg">
                <User className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">
                  {user?.displayName || user?.email || "ユーザー"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-slate-800 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                    isActive
                      ? "border-yellow-400 text-yellow-400"
                      : "border-transparent text-gray-300 hover:text-yellow-400 hover:border-yellow-400"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
