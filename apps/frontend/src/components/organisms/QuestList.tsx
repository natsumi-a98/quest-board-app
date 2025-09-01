"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/services/httpClient";
import { Search, Sword, Book, Wrench } from "lucide-react";

interface User {
  id: number;
  name: string;
}

interface Reward {
  point_amount: number;
  incentive_amount: number;
}

interface QuestParticipant {
  user: User;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  icon: string;
  type: string;
  status: string;
  difficulty: string;
  end_date: string;
  maxParticipants: number | null;
  rewards?: Reward | null;
  quest_participants: QuestParticipant[];
  tags: string[];
  _count: {
    quest_participants: number;
  };
}

const QuestList: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await apiClient.get<Quest[]>("/api/quests");
        setQuests(data);
      } catch (err) {
        console.error(err);
        setQuests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuests();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Sword":
        return <Sword className="w-6 h-6" />;
      case "Book":
        return <Book className="w-6 h-6" />;
      case "Wrench":
        return <Wrench className="w-6 h-6" />;
      default:
        return <Sword className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "募集中";
      case "in_progress":
        return "進行中";
      case "inactive":
        return "停止中";
      case "completed":
        return "完了";
      default:
        return "不明";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredQuests = quests.filter((quest) => {
    const matchesFilter =
      selectedFilter === "all" || quest.status === selectedFilter;

    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        クエストを読み込み中...
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="クエストを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="all">全てのクエスト</option>
              <option value="active">募集中</option>
              <option value="in_progress">進行中</option>
              <option value="inactive">停止中</option>
              <option value="completed">完了済み</option>
            </select>
          </div>
        </div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-200 relative overflow-hidden"
            >
              {/* Status Ribbon */}
              <div className="absolute top-0 right-0">
                <div
                  className={`px-3 py-1 text-xs font-semibold rounded-bl-lg border-l border-b ${getStatusColor(
                    quest.status
                  )}`}
                >
                  {getStatusText(quest.status)}
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="absolute top-4 left-4">
                <div
                  className={`w-3 h-3 rounded-full ${getDifficultyColor(
                    quest.difficulty
                  )}`}
                ></div>
              </div>

              <div className="p-6 pt-8">
                {/* Quest Icon and Title */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-yellow-400">
                    {getIconComponent(quest.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {quest.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {quest.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quest Details */}
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>タイプ:</span>
                    <span className="font-semibold capitalize">
                      {quest.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>難易度:</span>
                    <span className="font-semibold">{quest.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>報酬:</span>
                    <div className="text-right">
                      <div className="font-semibold text-yellow-600">
                        {quest.rewards?.point_amount ?? 0} GP
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatCurrency(quest.rewards?.incentive_amount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>参加者:</span>
                    <span className="font-semibold">
                      {quest._count.quest_participants}/{quest.maxParticipants}
                      名
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>期限:</span>
                    <span className="font-semibold text-xs">
                      {formatDate(quest.end_date)}
                    </span>
                  </div>
                </div>

                {/* Participants List */}
                {quest.quest_participants.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-slate-600 mb-2">
                      参加メンバー:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {quest.quest_participants
                        .slice(0, 3)
                        .map((participant, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {participant.user.name}
                          </span>
                        ))}
                      {quest.quest_participants.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{quest.quest_participants.length - 3}名
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>参加状況</span>
                    <span>
                      {(() => {
                        const total = quest.maxParticipants ?? 0;
                        const percent =
                          total > 0
                            ? Math.round(
                                (quest._count.quest_participants / total) * 100
                              )
                            : 0;
                        return percent;
                      })()}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(() => {
                          const total = quest.maxParticipants ?? 0;
                          const percent =
                            total > 0
                              ? (quest._count.quest_participants / total) * 100
                              : 0;
                          return percent;
                        })()}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedQuest(quest);
                    setIsDialogOpen(true);
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                    quest.status === "active"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                      : quest.status === "in_progress"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white cursor-not-allowed opacity-75"
                      : quest.status === "inactive"
                      ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed opacity-75"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed opacity-75"
                  }`}
                  disabled={quest.status !== "active"}
                >
                  {quest.status === "active" && "クエストに参加する"}
                  {quest.status === "in_progress" && "クエスト進行中"}
                  {quest.status === "inactive" && "クエスト停止中"}
                  {quest.status === "completed" && "クエスト完了済み"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              クエストが見つかりません
            </h3>
            <p className="text-gray-400">検索条件を変更してお試しください</p>
          </div>
        )}
        <QuestJoinDialog
  quest={selectedQuest}
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
/>

      </main>
    </div>
  );
};

export default QuestList;
