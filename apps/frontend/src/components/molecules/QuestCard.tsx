import React from "react";
import { Crown } from "lucide-react";
import { statusConfig, difficultyColors } from "../../constants/config";
import Tag from "../atoms/Tag";
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
  const config = statusConfig[status];

  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-stone-100 p-6 rounded-lg border-4 border-amber-200 shadow-xl">
      <StatusRibbon status={status} />

      {/* カード装飾 */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-amber-400 rounded-full opacity-20"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-amber-300 rounded-full opacity-20"></div>

      <div className="mb-4">
        <h3 className="font-bold text-lg text-amber-900 mb-2 font-serif">
          {quest.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <Tag color={difficultyColors[quest.difficulty]}>
            {quest.difficulty}
          </Tag>
          <Tag color="blue">{quest.category}</Tag>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-amber-700">
          <Crown className="w-4 h-4" />
          <span className="font-semibold">{quest.reward}pt</span>
        </div>

        {status === "participating" && (
          <div className="text-sm text-stone-600">進捗: {quest.progress}%</div>
        )}
        {status === "completed" && (
          <div className="text-sm text-green-600">
            完了: {quest.completedDate}
          </div>
        )}
        {status === "applied" && (
          <div className="text-sm text-orange-600">
            応募: {quest.appliedDate}
          </div>
        )}
      </div>

      {status === "participating" && (
        <div className="mt-4">
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${quest.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestCard;
