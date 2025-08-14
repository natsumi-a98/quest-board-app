import React, { useState } from "react";
import Button from "../atoms/Button";
import { Sword, Clock, CheckCircle, AlertCircle } from "lucide-react";
import QuestCard from "../molecules/QuestCard";

type Quest = {
  id: number;
  title: string;
  reward: number;
  deadline?: string;
  progress?: number;
  difficulty: "初級" | "中級" | "上級";
  category: string;
  completedDate?: string;
  appliedDate?: string;
};

type QuestData = {
  participating: Quest[];
  completed: Quest[];
  applied: Quest[];
};

type QuestHistoryProps = {
  questData: QuestData;
};

// タブ切り替え付きクエスト一覧
const QuestHistory: React.FC<QuestHistoryProps> = ({ questData }) => {
  const [activeTab, setActiveTab] = useState<keyof QuestData>("participating");

  const tabs = [
    { key: "participating" as const, label: "参加中", icon: Clock },
    { key: "completed" as const, label: "達成済み", icon: CheckCircle },
    { key: "applied" as const, label: "応募中", icon: AlertCircle },
  ];

  const currentQuests = questData[activeTab] || [];

  return (
    <div className="bg-gradient-to-br from-stone-50 to-amber-50 p-6 rounded-xl border-4 border-stone-300 shadow-xl">
      <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2 font-serif">
        <Sword className="w-6 h-6" />
        クエスト履歴
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            active={activeTab === key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuests.length > 0 ? (
          currentQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} status={activeTab} />
          ))
        ) : (
          <div className="col-span-full text-center text-stone-500 py-8">
            <Sword className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>該当するクエストがありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestHistory;
