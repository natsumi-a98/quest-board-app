// src/components/organisms/Header.tsx
"use client";

import React, { useState } from "react";
import { Sword, Award, Bell, User, Settings } from "lucide-react";

export const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("quests");

  const navItems = [
    {
      id: "quests",
      label: "クエスト一覧",
      icon: <Sword className="w-5 h-5" />,
    },
    {
      id: "my-quests",
      label: "マイクエスト",
      icon: <User className="w-5 h-5" />,
    },
    { id: "rewards", label: "報酬交換所", icon: <Award className="w-5 h-5" /> },
    {
      id: "dashboard",
      label: "ダッシュボード",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="shadow-lg">
      {/* Header */}
      <header className="bg-slate-800 border-b-4 border-yellow-400">
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

            {/* ユーザー情報 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">1,250 GP</span>
              </div>
              <Bell className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors" />
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-gray-300" />
                <span className="text-sm">冒険者</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-yellow-400 text-yellow-400"
                    : "border-transparent text-gray-300 hover:text-yellow-400 hover:border-yellow-400"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};
