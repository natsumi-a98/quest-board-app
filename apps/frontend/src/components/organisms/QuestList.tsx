"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Sword,
  Book,
  Wrench,
  Crown,
  Clock,
  Star,
  Users,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Eye,
} from "lucide-react";
import QuestJoinDialog from "@/components/organisms/QuestJoinDialog";
import StatusRibbon from "@/components/atoms/StatusRibbon";
import { questService } from "@/services/quest";
import { reviewService } from "@/services/review";
import { userService } from "@/services/user";
import { Quest, QuestStatus, QuestDifficulty } from "@/types/quest";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const QuestList: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [buttonActions, setButtonActions] = useState<Map<number, any>>(
    new Map()
  );
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await questService.getAllQuests();
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

  // ユーザーIDを動的に取得
  useEffect(() => {
    const fetchUserId = async () => {
      if (!user || !isAuthenticated) {
        setCurrentUserId(null);
        return;
      }

      try {
        const userData = await userService.getCurrentUser();
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error("QuestList: ユーザーID取得エラー:", error);
        setCurrentUserId(null);
      }
    };

    fetchUserId();
  }, [user, isAuthenticated]);

  // クエストデータが取得されたら、各クエストのボタンアクションを決定
  useEffect(() => {
    const updateButtonActions = async () => {
      if (quests.length === 0 || !currentUserId) return;

      const newButtonActions = new Map();
      for (const quest of quests) {
        if (quest.status === "completed") {
          const action = await getCompletedQuestButtonAction(quest);
          newButtonActions.set(quest.id, action);
        }
      }
      setButtonActions(newButtonActions);
    };

    updateButtonActions();
  }, [quests, user, isAuthenticated, currentUserId]);

  const getIconComponent = (questType: string) => {
    switch (questType) {
      case "development":
        return <Wrench className="w-6 h-6" />;
      case "learning":
        return <Book className="w-6 h-6" />;
      case "challenge":
        return <Sword className="w-6 h-6" />;
      default:
        return <Sword className="w-6 h-6" />;
    }
  };

  const getDifficultyColor = (difficulty?: QuestDifficulty) => {
    switch (difficulty) {
      case QuestDifficulty.Beginner:
        return "bg-green-500";
      case QuestDifficulty.Intermediate:
        return "bg-yellow-500";
      case QuestDifficulty.Advanced:
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

  const formatCurrency = (amount?: string | number) => {
    if (!amount) return "-";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "-";
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  // ユーザーがクエストに参加しているかどうかを判定
  const isUserParticipant = (quest: Quest): boolean => {
    if (!user || !isAuthenticated || !currentUserId) return false;

    const isParticipant =
      quest.quest_participants?.some((participant) => {
        return participant.user.id === currentUserId;
      }) || false;

    return isParticipant;
  };

  // ユーザーがレビューを投稿済みかどうかを判定
  const hasUserSubmittedReview = async (quest: Quest): Promise<boolean> => {
    if (!user || !isAuthenticated || !currentUserId) return false;

    const participant = quest.quest_participants?.find((p) => {
      return p.user.id === currentUserId;
    });

    if (!participant) return false;

    // 実際のAPIを呼び出してレビュー投稿状況を確認
    try {
      const response = await reviewService.checkUserReviewExists(
        currentUserId.toString(),
        quest.id.toString()
      );
      return response.exists;
    } catch (error) {
      console.error("レビュー投稿状況確認エラー:", error);
      return false;
    }
  };

  // 完了したクエストのボタンアクションを決定
  const getCompletedQuestButtonAction = async (quest: Quest) => {
    if (!isAuthenticated) {
      return {
        text: "レビューを見る",
        action: () => router.push(`/quests/${quest.id}`),
        icon: Eye,
        className:
          "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700",
      };
    }

    const isParticipant = isUserParticipant(quest);
    const hasSubmittedReview = await hasUserSubmittedReview(quest);

    if (isParticipant && !hasSubmittedReview) {
      return {
        text: "レビューを投稿する",
        action: () => router.push(`/quests/${quest.id}?action=review`),
        icon: MessageSquare,
        className:
          "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700",
      };
    } else {
      return {
        text: "レビューを見る",
        action: () => router.push(`/quests/${quest.id}`),
        icon: Eye,
        className:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
      };
    }
  };

  const filteredQuests = quests.filter((quest) => {
    const matchesFilter =
      selectedFilter === "all" || quest.status === selectedFilter;

    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quest.tags ?? []).some((tag) =>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
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
                    {getIconComponent(quest.type)}
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
                  {(quest.tags ?? []).map((tag, index) => (
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
                    <span className="font-semibold">
                      {quest.difficulty || "未設定"}
                    </span>
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
                      {quest._count?.quest_participants ?? 0}/
                      {quest.maxParticipants}名
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
                {quest.quest_participants &&
                  quest.quest_participants.length > 0 && (
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
                      {Math.round(
                        ((quest._count?.quest_participants || 0) /
                          quest.maxParticipants) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(() => {
                          const total = quest.maxParticipants;
                          const current = quest._count?.quest_participants || 0;
                          return total > 0 ? (current / total) * 100 : 0;
                        })()}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                {quest.status === "active" ? (
                  <button
                    onClick={() => {
                      setSelectedQuest(quest);
                      setIsDialogOpen(true);
                    }}
                    className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  >
                    クエストに参加する
                  </button>
                ) : quest.status === "completed" ? (
                  (() => {
                    const buttonAction = buttonActions.get(quest.id);
                    if (!buttonAction) {
                      return (
                        <button
                          disabled
                          className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform shadow-md bg-gray-300 text-gray-500 cursor-not-allowed"
                        >
                          読み込み中...
                        </button>
                      );
                    }
                    const IconComponent = buttonAction.icon;
                    return (
                      <button
                        onClick={buttonAction.action}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${buttonAction.className}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {buttonAction.text}
                        </div>
                      </button>
                    );
                  })()
                ) : (
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                      quest.status === "in_progress"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white cursor-not-allowed opacity-75"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed opacity-75"
                    }`}
                    disabled
                  >
                    {quest.status === "in_progress" && "クエスト進行中"}
                    {quest.status === "inactive" && "クエスト停止中"}
                  </button>
                )}
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
