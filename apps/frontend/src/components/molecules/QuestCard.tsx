import React from "react";
import StatusRibbon from "../atoms/StatusRibbon";
import Tag from "../atoms/Tag";
import DifficultyBadge from "../atoms/DifficultyBadge";
import QuestTitle from "./QuestTitle";
import { useRouter } from "next/navigation";

interface Quest {
  id: number;
  title: string;
  reward: number;
  deadline?: string;
  progress?: number;
  difficulty: "初級" | "中級" | "上級";
  status: string;
  category: string;
  completedDate?: string;
  appliedDate?: string;
}

interface QuestCardProps {
  quest: Quest;
  status: "participating" | "completed" | "applied";
  onActionClick: (quest: Quest) => void;
}

// クエスト情報のカード
const QuestCard: React.FC<QuestCardProps> = ({ quest, onActionClick }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/quests/${quest.id}`); // 詳細ページへ
  };

  return (
    <div
      className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-200 relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Status Ribbon */}
      <StatusRibbon
        status={
          quest.status === "active"
            ? "participating"
            : quest.status === "completed"
            ? "completed"
            : "applied"
        }
      />

      {/* Difficulty Badge */}
      <div className="absolute top-4 left-4">
        <DifficultyBadge difficulty={quest.difficulty} />
      </div>

      <div className="p-6 pt-8">
        {/* Quest Title */}
        <QuestTitle
          title={quest.title}
          description="クエストの詳細情報がここに表示されます"
        />

        {/* Category Tag */}
        <Tag>{quest.category}</Tag>

        {/* Quest Details */}
        <div className="space-y-2 mb-4 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>難易度:</span>
            <span className="font-semibold">{quest.difficulty}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>報酬:</span>
            <div className="text-right">
              <div className="font-semibold text-yellow-600">
                {quest.reward} ポイント
              </div>
            </div>
          </div>
          {quest.deadline && (
            <div className="flex items-center justify-between">
              <span>期限:</span>
              <span className="font-semibold text-xs">
                {new Date(quest.deadline).toLocaleDateString("ja-JP")}
              </span>
            </div>
          )}
          {quest.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>進捗:</span>
                <span className="text-blue-400 text-sm">{quest.progress}%</span>
              </div>
              <div className="w-full bg-slate-300 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${quest.progress}%` }}
                ></div>
              </div>
            </div>
          )}
          {quest.completedDate && (
            <div className="flex items-center justify-between">
              <span>完了日:</span>
              <span className="font-semibold text-xs text-green-600">
                {new Date(quest.completedDate).toLocaleDateString("ja-JP")}
              </span>
            </div>
          )}
          {quest.appliedDate && (
            <div className="flex items-center justify-between">
              <span>応募日:</span>
              <span className="font-semibold text-xs text-orange-600">
                {new Date(quest.appliedDate).toLocaleDateString("ja-JP")}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // カードクリックと分離
            onActionClick(quest);
          }}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
            status === "participating"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              : status === "applied"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-not-allowed opacity-75"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed opacity-75"
          }`}
          disabled={status !== "participating"}
        >
          {status === "participating" && "クエストを続行"}
          {status === "applied" && "応募済み"}
          {status === "completed" && "クエスト完了済み"}
        </button>
      </div>
    </div>
  );
};

export default QuestCard;
