import React from "react";
import StatusRibbon from "../atoms/StatusRibbon";

interface Quest {
  id: number;
  title: string;
  reward: number;
  deadline?: string;
  progress?: number;
  difficulty: "初級" | "中級" | "上級";
  category: string;
  completedDate?: string;
  appliedDate?: string;
}

interface QuestCardProps {
  quest: Quest;
  status: "participating" | "completed" | "applied";
}

// クエスト情報のカード
const QuestCard: React.FC<QuestCardProps> = ({ quest, status }) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "初級":
        return "bg-green-500";
      case "中級":
        return "bg-yellow-500";
      case "上級":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number): string => {
    if (typeof amount !== "number" || isNaN(amount)) return "-";
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-200 relative overflow-hidden">
      <StatusRibbon status={status} />

      {/* Difficulty Badge */}
      <div className="absolute top-4 left-4">
        <div
          className={`w-3 h-3 rounded-full ${getDifficultyColor(
            quest.difficulty
          )}`}
        ></div>
      </div>

      <div className="p-6 pt-8">
        {/* Quest Title */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {quest.title}
          </h3>
          <p className="text-sm text-slate-600">
            クエストの詳細情報がここに表示されます
          </p>
        </div>

        {/* Category Tag */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-medium">
            {quest.category}
          </span>
        </div>

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
