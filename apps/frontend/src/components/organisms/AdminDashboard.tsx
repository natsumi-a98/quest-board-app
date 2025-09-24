"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Sword,
  Crown,
  Users,
  Trophy,
  Eye,
  EyeOff,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Star,
  Coins,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  Edit,
} from "lucide-react";
import { Quest, QuestStatus, QuestType } from "../../types/quest";
import { questService } from "../../services/quest";
import { userService, UserResponse } from "../../services/user";

// 型定義
type QuestPriority = "critical" | "high" | "medium" | "low";
type QuestCategory = "education" | "security" | "event" | "innovation";

interface User extends UserResponse {
  level: number;
  totalRewards: number;
  completedQuests: number;
  joinDate: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "quests" | "rewards" | "users"
  >("dashboard");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [quests, setQuests] = useState<Quest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState<boolean>(false);
  const [questToDelete, setQuestToDelete] = useState<Quest | null>(null);
  const [questToEdit, setQuestToEdit] = useState<Quest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // トースト通知を表示する関数
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // 3秒後に自動で非表示
  };

  // クエストデータとユーザーデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // クエストデータとユーザーデータを並行取得
        const [questData, userData] = await Promise.all([
          questService.getAllQuests(),
          userService.getAllUsers(),
        ]);

        setQuests(questData);

        // ユーザーデータにダミーの統計情報を追加
        const usersWithStats: User[] = userData.map((user, index) => ({
          ...user,
          level: Math.floor(Math.random() * 20) + 1, // 1-20のランダムレベル
          totalRewards: Math.floor(Math.random() * 5000) + 500, // 500-5500のランダム報酬
          completedQuests: Math.floor(Math.random() * 15) + 1, // 1-15のランダム完了クエスト数
          joinDate: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0], // 過去1年以内のランダム日付
        }));

        setUsers(usersWithStats);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardStats = {
    totalQuests: quests.length,
    pendingQuests: quests.filter((q) => (q.status as string) === "pending")
      .length,
    completedQuests: quests.filter((q) => q.status === "completed").length,
    activeUsers: users.length,
    totalRewards: quests.reduce(
      (sum, quest) => sum + (quest.rewards?.point_amount || 0),
      0
    ),
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "active":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "draft":
        return "bg-gray-500";
      case "in_progress":
        return "bg-purple-500";
      case "inactive":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: QuestPriority): string => {
    switch (priority) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "pending":
        return "承認待ち";
      case "active":
        return "公開中";
      case "completed":
        return "完了";
      case "draft":
        return "下書き";
      case "in_progress":
        return "進行中";
      case "inactive":
        return "停止中";
      default:
        return status;
    }
  };

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch = quest.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || quest.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleQuestAction = async (
    questId: number,
    action: string
  ): Promise<void> => {
    try {
      if (action === "approve") {
        await questService.updateQuestStatus(questId.toString(), "active");
      } else if (action === "reject") {
        await questService.updateQuestStatus(questId.toString(), "draft");
        // 却下時のトースト通知表示（API呼び出し成功後）
        showToast("クエストを却下しました。ステータスが下書きに戻されました。");
      } else if (action === "hide") {
        await questService.updateQuestStatus(questId.toString(), "inactive");
      } else if (action === "publish") {
        await questService.updateQuestStatus(questId.toString(), "active");
      } else if (action === "submit_for_approval") {
        await questService.updateQuestStatus(questId.toString(), "pending");
        // 承認待ち申請時のトースト通知表示
        showToast(
          "クエストを承認待ちにしました。管理者の承認をお待ちください。"
        );
      } else if (action === "start_progress") {
        await questService.updateQuestStatus(questId.toString(), "in_progress");
        // 進行中開始時のトースト通知表示
        showToast("クエストを進行中にしました。");
      } else if (action === "complete") {
        await questService.updateQuestStatus(questId.toString(), "completed");
        // 完了時のトースト通知表示
        showToast("クエストを完了にしました。");
      } else if (action === "reactivate") {
        await questService.reactivateQuest(questId.toString());
      } else if (action === "edit") {
        const quest = quests.find((q) => q.id === questId);
        if (quest) {
          setQuestToEdit(quest);
          return;
        }
      } else if (action === "delete") {
        const quest = quests.find((q) => q.id === questId);
        if (quest) {
          setQuestToDelete(quest);
          return;
        }
      }

      // クエストリストを再取得
      const questData = await questService.getAllQuests();
      setQuests(questData);
      setSelectedQuest(null);
    } catch (err) {
      console.error(`Failed to ${action} quest:`, err);
      setError(`クエストの${action}に失敗しました`);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!questToDelete) return;

    try {
      await questService.deleteQuest(questToDelete.id.toString());

      // クエストリストを再取得
      const questData = await questService.getAllQuests();
      setQuests(questData);
      setQuestToDelete(null);
      setSelectedQuest(null);
    } catch (err) {
      console.error("Failed to delete quest:", err);
      setError("クエストの削除に失敗しました");
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }) => (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-800 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuestRow = ({
    quest,
    onClick,
  }: {
    quest: Quest;
    onClick: (quest: Quest) => void;
  }) => (
    <div
      className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick(quest)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-800">{quest.title}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                quest.status
              )}`}
            >
              {getStatusText(quest.status)}
            </span>
            {/* Priority is not available in Quest interface */}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-800">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {quest._count.quest_participants}/{quest.maxParticipants}名
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4" />
              {(quest.rewards?.point_amount || 0).toLocaleString()}P
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(quest.end_date).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-amber-600" />
      </div>
    </div>
  );

  const CreateQuestForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      type: "development",
      status: "draft",
      maxParticipants: 5,
      tags: "",
      start_date: "",
      end_date: "",
      incentive_amount: 0,
      point_amount: 0,
      note: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const tagsArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        await questService.createQuest({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          status: formData.status,
          maxParticipants: formData.maxParticipants,
          tags: tagsArray,
          start_date: formData.start_date,
          end_date: formData.end_date,
          incentive_amount: formData.incentive_amount,
          point_amount: formData.point_amount,
          note: formData.note,
        });

        // クエストリストを再取得
        const questData = await questService.getAllQuests();
        setQuests(questData);
        onClose();
      } catch (err) {
        console.error("Failed to create quest:", err);
        setError("クエストの作成に失敗しました");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-4 border-amber-300">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-slate-800 font-serif">
              新しいクエストを作成
            </h2>
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  タイトル *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                  placeholder="クエストのタイトル"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  タイプ *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                >
                  <option value="development">開発</option>
                  <option value="learning">学習</option>
                  <option value="challenge">チャレンジ</option>
                  <option value="design">デザイン</option>
                  <option value="planning">企画</option>
                  <option value="maintenance">保守</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  ステータス
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                >
                  <option value="draft">下書き</option>
                  <option value="pending">承認待ち</option>
                  <option value="active">公開中</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  最大参加者数 *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxParticipants: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  開始日 *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  終了日 *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  インセンティブ金額（円）
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.incentive_amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incentive_amount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                  placeholder="例: 50,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  ポイント数
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.point_amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      point_amount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                  placeholder="例: 500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                説明 *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="クエストの詳細説明"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="例: React, TypeScript, フロントエンド"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                報酬備考
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="報酬に関する備考"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "作成中..." : "クエストを作成"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditQuestForm = ({
    quest,
    onClose,
  }: {
    quest: Quest;
    onClose: () => void;
  }) => {
    const [formData, setFormData] = useState<{
      title: string;
      description: string;
      type: string;
      status: string;
      maxParticipants: number;
      tags: string;
      start_date: string;
      end_date: string;
      incentive_amount: number;
      point_amount: number;
      note: string;
    }>({
      title: quest.title,
      description: quest.description,
      type: quest.type,
      status: quest.status,
      maxParticipants: quest.maxParticipants,
      tags: (quest.tags ?? []).join(", "),
      start_date: quest.start_date.split("T")[0],
      end_date: quest.end_date.split("T")[0],
      incentive_amount: Number(quest.rewards?.incentive_amount) || 0,
      point_amount: Number(quest.rewards?.point_amount) || 0,
      note: quest.rewards?.note || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const tagsArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        await questService.updateQuest(quest.id.toString(), {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          status: formData.status,
          maxParticipants: formData.maxParticipants,
          tags: tagsArray,
          start_date: formData.start_date,
          end_date: formData.end_date,
          incentive_amount: formData.incentive_amount || 0,
          point_amount: formData.point_amount || 0,
          note: formData.note,
        });

        // クエストリストを再取得
        const questData = await questService.getAllQuests();
        setQuests(questData);
        showToast("クエストを更新しました。");
        onClose();
      } catch (err) {
        console.error("Failed to update quest:", err);
        setError("クエストの更新に失敗しました");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border-4 border-amber-300">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-slate-800 font-serif">
              クエストを編集
            </h2>
            <button
              onClick={onClose}
              className="text-amber-600 hover:text-amber-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                タイトル *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="クエストのタイトル"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                説明 *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="クエストの詳細説明"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  タイプ *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as QuestType,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                >
                  <option value="development">開発</option>
                  <option value="design">デザイン</option>
                  <option value="marketing">マーケティング</option>
                  <option value="research">リサーチ</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  ステータス *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as QuestStatus,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                >
                  <option value="draft">下書き</option>
                  <option value="pending">承認待ち</option>
                  <option value="active">公開中</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">完了</option>
                  <option value="inactive">停止中</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                最大参加者数 *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxParticipants: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                開始日 *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                終了日 *
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  インセンティブ金額
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.incentive_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      incentive_amount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  ポイント数
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.point_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      point_amount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                タグ
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="例: React, TypeScript, フロントエンド"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                報酬備考
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                placeholder="報酬に関する備考"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "更新中..." : "クエストを更新"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmDialog = ({
    quest,
    onConfirm,
    onCancel,
  }: {
    quest: Quest;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 max-w-md w-full mx-4 border-4 border-amber-300">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-slate-800 font-serif">
            クエストを削除
          </h2>
          <button
            onClick={onCancel}
            className="text-amber-600 hover:text-amber-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-800 mb-4">
            以下のクエストを削除してもよろしいですか？
          </p>
          <div className="bg-white p-4 rounded-lg border-2 border-amber-200">
            <h3 className="font-semibold text-slate-800 mb-2">{quest.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {quest.description}
            </p>
          </div>
          <p className="text-red-600 text-sm mt-4 font-medium">
            ⚠️ この操作は取り消せません。関連する参加者データも削除されます。
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );

  const QuestDetail = ({
    quest,
    onClose,
  }: {
    quest: Quest;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border-4 border-amber-300">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-slate-800 font-serif">
            {quest.title}
          </h2>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm">
            <span className="font-medium text-slate-800">ステータス: </span>
            <span
              className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                quest.status
              )}`}
            >
              {getStatusText(quest.status)}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-slate-800">優先度: </span>
            {/* Priority is not available in Quest interface */}
          </div>
          <div className="text-sm">
            <span className="font-medium text-slate-800">参加者: </span>
            <span>
              {quest._count.quest_participants}/{quest.maxParticipants}名
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-slate-800">報酬: </span>
            <span className="font-bold text-yellow-600">
              {(quest.rewards?.point_amount || 0).toLocaleString()}P
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-slate-800 mb-2">クエスト詳細</h3>
          <p className="text-slate-800 text-sm leading-relaxed">
            {quest.description}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-2">タグ</h3>
          <div className="flex flex-wrap gap-2">
            {quest.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            )) || <span className="text-gray-500 text-sm">タグなし</span>}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(quest.status as string) === "pending" && (
            <>
              <button
                onClick={() => handleQuestAction(quest.id, "approve")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                承認
              </button>
              <button
                onClick={() => handleQuestAction(quest.id, "reject")}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                却下
              </button>
            </>
          )}
          {(quest.status as string) === "active" && (
            <>
              <button
                onClick={() => handleQuestAction(quest.id, "start_progress")}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Clock className="w-4 h-4" />
                進行中にする
              </button>
              <button
                onClick={() => handleQuestAction(quest.id, "hide")}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                非公開にする
              </button>
            </>
          )}
          {(quest.status as string) === "draft" && (
            <>
              <button
                onClick={() =>
                  handleQuestAction(quest.id, "submit_for_approval")
                }
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Clock className="w-4 h-4" />
                承認待ちにする
              </button>
              <button
                onClick={() => handleQuestAction(quest.id, "publish")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                公開
              </button>
            </>
          )}
          {(quest.status as string) === "in_progress" && (
            <button
              onClick={() => handleQuestAction(quest.id, "complete")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              完了にする
            </button>
          )}
          {(quest.status as string) === "inactive" && (
            <button
              onClick={() => handleQuestAction(quest.id, "reactivate")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              再公開
            </button>
          )}
          <button
            onClick={() => handleQuestAction(quest.id, "edit")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            編集
          </button>
          <button
            onClick={() => handleQuestAction(quest.id, "delete")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            削除
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-amber-100 p-1 rounded-lg border-2 border-amber-200">
            {(
              [
                { id: "dashboard", label: "ダッシュボード", icon: Shield },
                { id: "quests", label: "クエスト管理", icon: Sword },
                { id: "rewards", label: "報酬管理", icon: Trophy },
                { id: "users", label: "ユーザー管理", icon: Users },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-800 hover:bg-amber-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ダッシュボード */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="総クエスト数"
                value={dashboardStats.totalQuests}
                icon={Sword}
                color="bg-blue-600"
              />
              <StatCard
                title="承認待ち"
                value={dashboardStats.pendingQuests}
                icon={Clock}
                color="bg-yellow-600"
              />
              <StatCard
                title="完了クエスト"
                value={dashboardStats.completedQuests}
                icon={Trophy}
                color="bg-green-600"
              />
              <StatCard
                title="総報酬ポイント"
                value={`${dashboardStats.totalRewards.toLocaleString()}P`}
                icon={Coins}
                color="bg-amber-600"
              />
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 font-serif">
                最近のアクティビティ
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-slate-800">
                    新しいクエスト「AIツール導入の検証」が申請されました
                  </span>
                  <span className="text-amber-600 text-xs">2時間前</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-slate-800">
                    クエスト「チームビルディングイベント企画」が完了しました
                  </span>
                  <span className="text-amber-600 text-xs">1日前</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-800">
                    新しいユーザー「山田 次郎」が参加しました
                  </span>
                  <span className="text-amber-600 text-xs">3日前</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* クエスト管理 */}
        {activeTab === "quests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 font-serif">
                クエスト管理
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreateQuestOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  新しいクエストを作成
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="クエストを検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 placeholder-amber-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-slate-800 focus:outline-none focus:border-yellow-400"
                >
                  <option value="all">全て</option>
                  <option value="pending">承認待ち</option>
                  <option value="active">公開中</option>
                  <option value="completed">完了</option>
                  <option value="draft">下書き</option>
                  <option value="in_progress">進行中</option>
                  <option value="inactive">停止中</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-slate-800">読み込み中...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-600">{error}</div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuests.map((quest) => (
                  <QuestRow
                    key={quest.id}
                    quest={quest}
                    onClick={setSelectedQuest}
                  />
                ))}
                {filteredQuests.length === 0 && (
                  <div className="text-center py-12 text-slate-800">
                    クエストが見つかりませんでした
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 報酬管理 */}
        {activeTab === "rewards" && (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 font-serif">
              報酬管理
            </h2>
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <p className="text-slate-800 text-lg">報酬管理機能は開発中です</p>
              <p className="text-amber-600 text-sm mt-2">
                ユーザーへのインセンティブ付与機能を準備中...
              </p>
            </div>
          </div>
        )}

        {/* ユーザー管理 */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 font-serif">
              ユーザー管理
            </h2>

            <div className="grid gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {user.name}
                        </h3>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Lv.{user.level}
                        </span>
                        <span className="text-sm text-slate-800">
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-800">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          完了: {user.completedQuests}件
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          報酬: {user.totalRewards}P
                        </span>
                        <span>参加日: {user.joinDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* クエスト詳細モーダル */}
      {selectedQuest && (
        <QuestDetail
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
        />
      )}

      {/* クエスト作成フォームモーダル */}
      {isCreateQuestOpen && (
        <CreateQuestForm onClose={() => setIsCreateQuestOpen(false)} />
      )}

      {/* クエスト編集フォームモーダル */}
      {questToEdit && (
        <EditQuestForm
          quest={questToEdit}
          onClose={() => setQuestToEdit(null)}
        />
      )}

      {/* 削除確認ダイアログ */}
      {questToDelete && (
        <DeleteConfirmDialog
          quest={questToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setQuestToDelete(null)}
        />
      )}

      {/* トースト通知 */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
