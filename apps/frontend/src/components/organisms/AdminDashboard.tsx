import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';

// 型定義
type QuestStatus = 'pending' | 'approved' | 'completed' | 'draft';
type QuestPriority = 'critical' | 'high' | 'medium' | 'low';
type QuestCategory = 'education' | 'security' | 'event' | 'innovation';

interface Quest {
  id: number;
  title: string;
  participants: number;
  maxParticipants: number;
  status: QuestStatus;
  priority: QuestPriority;
  reward: number;
  deadline: string;
  description: string;
  requiredSkills: string[];
  category: QuestCategory;
}

interface User {
  id: number;
  name: string;
  level: number;
  totalRewards: number;
  completedQuests: number;
  role: string;
  joinDate: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quests' | 'rewards' | 'users'>('dashboard');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | QuestStatus>('all');

  // サンプルデータ
  const quests: Quest[] = [
    {
      id: 1,
      title: "新人研修プログラムの作成",
      participants: 3,
      maxParticipants: 5,
      status: "pending",
      priority: "high",
      reward: 500,
      deadline: "2024-10-15",
      description: "新人エンジニア向けの研修カリキュラムを作成し、実施する",
      requiredSkills: ["教育", "プログラミング", "資料作成"],
      category: "education"
    },
    {
      id: 2,
      title: "社内システムのセキュリティ監査",
      participants: 2,
      maxParticipants: 3,
      status: "approved",
      priority: "critical",
      reward: 1000,
      deadline: "2024-09-30",
      description: "社内で使用しているシステムのセキュリティ脆弱性を調査",
      requiredSkills: ["セキュリティ", "監査", "ネットワーク"],
      category: "security"
    },
    {
      id: 3,
      title: "チームビルディングイベント企画",
      participants: 5,
      maxParticipants: 5,
      status: "completed",
      priority: "medium",
      reward: 300,
      deadline: "2024-09-20",
      description: "部署内のコミュニケーション活性化のためのイベントを企画・実行",
      requiredSkills: ["企画", "コミュニケーション"],
      category: "event"
    },
    {
      id: 4,
      title: "AIツール導入の検証",
      participants: 1,
      maxParticipants: 4,
      status: "draft",
      priority: "medium",
      reward: 750,
      deadline: "2024-11-01",
      description: "業務効率化のためのAIツールの検証と導入提案",
      requiredSkills: ["AI", "検証", "提案"],
      category: "innovation"
    }
  ];

  const users: User[] = [
    {
      id: 1,
      name: "田中 太郎",
      level: 15,
      totalRewards: 2500,
      completedQuests: 12,
      role: "冒険者",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "佐藤 花子",
      level: 22,
      totalRewards: 4200,
      completedQuests: 18,
      role: "熟練冒険者",
      joinDate: "2023-11-20"
    },
    {
      id: 3,
      name: "山田 次郎",
      level: 8,
      totalRewards: 800,
      completedQuests: 5,
      role: "見習い冒険者",
      joinDate: "2024-06-01"
    }
  ];

  const dashboardStats = {
    totalQuests: quests.length,
    pendingQuests: quests.filter(q => q.status === 'pending').length,
    completedQuests: quests.filter(q => q.status === 'completed').length,
    activeUsers: users.length,
    totalRewards: users.reduce((sum, user) => sum + user.totalRewards, 0)
  };

  const getStatusColor = (status: QuestStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: QuestPriority): string => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: QuestStatus): string => {
    switch (status) {
      case 'pending': return '承認待ち';
      case 'approved': return '公開中';
      case 'completed': return '完了';
      case 'draft': return '下書き';
      default: return status;
    }
  };

  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || quest.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleQuestAction = (questId: number, action: string): void => {
    console.log(`${action} quest ${questId}`);
    // 実際の処理はここに実装
  };

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }) => (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-800 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-amber-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuestRow = ({ quest, onClick }: {
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
            <h3 className="font-semibold text-amber-900">{quest.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(quest.status)}`}>
              {getStatusText(quest.status)}
            </span>
            <span className={`text-xs font-medium ${getPriorityColor(quest.priority)}`}>
              {quest.priority === 'critical' ? '緊急' :
               quest.priority === 'high' ? '高' :
               quest.priority === 'medium' ? '中' : '低'}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-amber-700">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {quest.participants}/{quest.maxParticipants}名
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4" />
              {quest.reward}P
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quest.deadline}
            </span>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-amber-600" />
      </div>
    </div>
  );

  const QuestDetail = ({ quest, onClose }: {
    quest: Quest;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border-4 border-amber-300">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-amber-900 font-serif">{quest.title}</h2>
          <button onClick={onClose} className="text-amber-600 hover:text-amber-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm">
            <span className="font-medium text-amber-800">ステータス: </span>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(quest.status)}`}>
              {getStatusText(quest.status)}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-amber-800">優先度: </span>
            <span className={`font-medium ${getPriorityColor(quest.priority)}`}>
              {quest.priority === 'critical' ? '緊急' :
               quest.priority === 'high' ? '高' :
               quest.priority === 'medium' ? '中' : '低'}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-amber-800">参加者: </span>
            <span>{quest.participants}/{quest.maxParticipants}名</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-amber-800">報酬: </span>
            <span className="font-bold text-yellow-600">{quest.reward}P</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-amber-900 mb-2">クエスト詳細</h3>
          <p className="text-amber-800 text-sm leading-relaxed">{quest.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-amber-900 mb-2">必要スキル</h3>
          <div className="flex flex-wrap gap-2">
            {quest.requiredSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {quest.status === 'pending' && (
            <>
              <button
                onClick={() => handleQuestAction(quest.id, 'approve')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                承認
              </button>
              <button
                onClick={() => handleQuestAction(quest.id, 'reject')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                却下
              </button>
            </>
          )}
          {quest.status === 'approved' && (
            <button
              onClick={() => handleQuestAction(quest.id, 'hide')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              非公開にする
            </button>
          )}
          {quest.status === 'draft' && (
            <button
              onClick={() => handleQuestAction(quest.id, 'publish')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              公開
            </button>
          )}
          <button
            onClick={() => handleQuestAction(quest.id, 'delete')}
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
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-yellow-400" />
                <h1 className="text-2xl font-bold text-white font-serif">Quest Board 管理者画面</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">管理者</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-amber-100 p-1 rounded-lg border-2 border-amber-200">
            {([
              { id: 'dashboard', label: 'ダッシュボード', icon: Shield },
              { id: 'quests', label: 'クエスト管理', icon: Sword },
              { id: 'rewards', label: '報酬管理', icon: Trophy },
              { id: 'users', label: 'ユーザー管理', icon: Users }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-amber-800 hover:bg-amber-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ダッシュボード */}
        {activeTab === 'dashboard' && (
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
                value={`${dashboardStats.totalRewards}P`}
                icon={Coins}
                color="bg-amber-600"
              />
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200">
              <h2 className="text-xl font-bold text-amber-900 mb-4 font-serif">最近のアクティビティ</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-amber-800">新しいクエスト「AIツール導入の検証」が申請されました</span>
                  <span className="text-amber-600 text-xs">2時間前</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-amber-800">クエスト「チームビルディングイベント企画」が完了しました</span>
                  <span className="text-amber-600 text-xs">1日前</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span className="text-amber-800">新しいユーザー「山田 次郎」が参加しました</span>
                  <span className="text-amber-600 text-xs">3日前</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* クエスト管理 */}
        {activeTab === 'quests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-white font-serif">クエスト管理</h2>

              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="クエストを検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-amber-900 placeholder-amber-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | QuestStatus)}
                  className="px-4 py-2 border-2 border-amber-300 rounded-lg bg-amber-50 text-amber-900 focus:outline-none focus:border-yellow-400"
                >
                  <option value="all">全て</option>
                  <option value="pending">承認待ち</option>
                  <option value="approved">公開中</option>
                  <option value="completed">完了</option>
                  <option value="draft">下書き</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredQuests.map((quest) => (
                <QuestRow
                  key={quest.id}
                  quest={quest}
                  onClick={setSelectedQuest}
                />
              ))}
            </div>
          </div>
        )}

        {/* 報酬管理 */}
        {activeTab === 'rewards' && (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 font-serif">報酬管理</h2>
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <p className="text-amber-700 text-lg">報酬管理機能は開発中です</p>
              <p className="text-amber-600 text-sm mt-2">ユーザーへのインセンティブ付与機能を準備中...</p>
            </div>
          </div>
        )}

        {/* ユーザー管理 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-serif">ユーザー管理</h2>

            <div className="grid gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-amber-900">{user.name}</h3>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Lv.{user.level}</span>
                        <span className="text-sm text-amber-700">{user.role}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-amber-700">
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
    </div>
  );
};

export default AdminDashboard;
