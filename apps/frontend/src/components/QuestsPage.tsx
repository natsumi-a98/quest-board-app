"use client";

import React, { useState } from 'react';
import { Search, Sword, Book, Wrench, Crown, Clock, Star, Users, Award, Bell, User, Settings, LogOut } from 'lucide-react';

const QuestBoardSystem = () => {
  const [activeTab, setActiveTab] = useState('quests');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Prismaスキーマに合わせたデータ構造
  const questData = [
    {
      id: 1,
      title: "新しいAPI設計の勇者求む",
      description: "RESTful APIの設計・実装を通じて、システム設計スキルを向上させよう！",
      type: "development",
      status: "active",
      start_date: "2025-07-01T00:00:00Z",
      end_date: "2025-07-15T23:59:59Z",
      created_at: "2025-06-15T09:00:00Z",
      updated_at: "2025-06-20T14:30:00Z",
      rewards: {
        incentive_amount: 50000,
        point_amount: 500,
        note: "API設計完了時のボーナス報酬"
      },
      quest_participants: [
        { user: { name: "佐藤太郎" }, joined_at: "2025-06-16T10:00:00Z" },
        { user: { name: "田中花子" }, joined_at: "2025-06-17T15:30:00Z" }
      ],
      _count: {
        quest_participants: 2
      },
      maxParticipants: 3,
      tags: ["API", "設計", "バックエンド"],
      difficulty: "中級",
      icon: <Wrench className="w-6 h-6" />
    },
    {
      id: 2,
      title: "TypeScript修行の旅",
      description: "TypeScriptの型安全性を学び、より堅牢なコードを書けるようになろう",
      type: "learning",
      status: "active",
      start_date: "2025-06-01T00:00:00Z",
      end_date: "2025-06-30T23:59:59Z",
      created_at: "2025-05-20T09:00:00Z",
      updated_at: "2025-06-25T16:20:00Z",
      rewards: {
        incentive_amount: 30000,
        point_amount: 300,
        note: "学習完了時の報酬"
      },
      quest_participants: [
        { user: { name: "山田次郎" }, joined_at: "2025-06-02T09:00:00Z" },
        { user: { name: "鈴木一郎" }, joined_at: "2025-06-03T11:00:00Z" },
        { user: { name: "高橋美咲" }, joined_at: "2025-06-05T14:00:00Z" },
        { user: { name: "伊藤健太" }, joined_at: "2025-06-07T16:00:00Z" }
      ],
      _count: {
        quest_participants: 4
      },
      maxParticipants: 5,
      tags: ["TypeScript", "フロントエンド", "学習"],
      difficulty: "初級",
      icon: <Book className="w-6 h-6" />
    },
    {
      id: 3,
      title: "パフォーマンス最適化の聖戦",
      description: "Webアプリケーションのパフォーマンス改善に挑戦！UXを向上させよう",
      type: "challenge",
      status: "active",
      start_date: "2025-07-01T00:00:00Z",
      end_date: "2025-08-10T23:59:59Z",
      created_at: "2025-06-20T09:00:00Z",
      updated_at: "2025-06-22T10:15:00Z",
      rewards: {
        incentive_amount: 80000,
        point_amount: 800,
        note: "パフォーマンス改善達成時の高額報酬"
      },
      quest_participants: [
        { user: { name: "中村智子" }, joined_at: "2025-06-21T13:00:00Z" }
      ],
      _count: {
        quest_participants: 1
      },
      maxParticipants: 2,
      tags: ["パフォーマンス", "最適化", "フロントエンド"],
      difficulty: "上級",
      icon: <Sword className="w-6 h-6" />
    },
    {
      id: 4,
      title: "セキュリティの守護者",
      description: "セキュリティベストプラクティスを学び、安全なアプリケーションの開発手法を身につけよう",
      type: "learning",
      status: "completed",
      start_date: "2025-05-01T00:00:00Z",
      end_date: "2025-05-31T23:59:59Z",
      created_at: "2025-04-15T09:00:00Z",
      updated_at: "2025-06-01T09:00:00Z",
      rewards: {
        incentive_amount: 60000,
        point_amount: 600,
        note: "セキュリティ学習完了報酬"
      },
      quest_participants: [
        { user: { name: "小林達也" }, joined_at: "2025-05-02T10:00:00Z", completed_at: "2025-05-30T18:00:00Z" },
        { user: { name: "渡辺さくら" }, joined_at: "2025-05-03T11:00:00Z", completed_at: "2025-05-29T17:30:00Z" },
        { user: { name: "松本雄介" }, joined_at: "2025-05-05T09:30:00Z", completed_at: "2025-05-31T16:45:00Z" }
      ],
      _count: {
        quest_participants: 3
      },
      maxParticipants: 4,
      tags: ["セキュリティ", "学習", "ベストプラクティス"],
      difficulty: "中級",
      icon: <Book className="w-6 h-6" />
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '募集中';
      case 'inactive': return '停止中';
      case 'completed': return '完了';
      default: return '不明';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初級': return 'bg-green-500';
      case '中級': return 'bg-yellow-500';
      case '上級': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "-";
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredQuests = questData.filter(quest => {
    const matchesFilter = selectedFilter === 'all' || quest.status === selectedFilter;
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b-4 border-yellow-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sword className="w-6 h-6 text-slate-800" />
                </div>
                <h1 className="text-2xl font-bold text-yellow-400" style={{fontFamily: 'serif'}}>
                  Quest Board
                </h1>
              </div>
            </div>
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
            {[
              { id: 'quests', label: 'クエスト一覧', icon: <Sword className="w-5 h-5" /> },
              { id: 'my-quests', label: 'マイクエスト', icon: <User className="w-5 h-5" /> },
              { id: 'rewards', label: '報酬交換所', icon: <Award className="w-5 h-5" /> },
              { id: 'dashboard', label: 'ダッシュボード', icon: <Settings className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-300 hover:text-yellow-400 hover:border-yellow-400'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'quests' && (
          <div>
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
                    <div className={`px-3 py-1 text-xs font-semibold rounded-bl-lg border-l border-b ${getStatusColor(quest.status)}`}>
                      {getStatusText(quest.status)}
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(quest.difficulty)}`}></div>
                  </div>

                  <div className="p-6 pt-8">
                    {/* Quest Icon and Title */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-yellow-400">
                        {quest.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{quest.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-3">{quest.description}</p>
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
                        <span className="font-semibold capitalize">{quest.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>難易度:</span>
                        <span className="font-semibold">{quest.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>報酬:</span>
                        <div className="text-right">
                          <div className="font-semibold text-yellow-600">{quest.rewards.point_amount} GP</div>
                          <div className="text-xs text-slate-500">{formatCurrency(quest.rewards.incentive_amount)}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>参加者:</span>
                        <span className="font-semibold">{quest._count.quest_participants}/{quest.maxParticipants}名</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>期限:</span>
                        <span className="font-semibold text-xs">{formatDate(quest.end_date)}</span>
                      </div>
                    </div>

                    {/* Participants List */}
                    {quest.quest_participants.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-slate-600 mb-2">参加メンバー:</div>
                        <div className="flex flex-wrap gap-1">
                          {quest.quest_participants.slice(0, 3).map((participant, index) => (
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
                        <span>{Math.round((quest._count.quest_participants / quest.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-300 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(quest._count.quest_participants / quest.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        quest.status === 'active'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                          : quest.status === 'inactive'
                          ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed opacity-75'
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed opacity-75'
                      }`}
                      disabled={quest.status !== 'active'}
                    >
                      {quest.status === 'active' && 'クエストに参加する'}
                      {quest.status === 'inactive' && 'クエスト停止中'}
                      {quest.status === 'completed' && 'クエスト完了済み'}
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
                <h3 className="text-xl font-semibold text-gray-300 mb-2">クエストが見つかりません</h3>
                <p className="text-gray-400">検索条件を変更してお試しください</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-quests' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">マイクエスト</h3>
            <p className="text-gray-400">参加中・完了したクエストの履歴を確認できます</p>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">報酬交換所</h3>
            <p className="text-gray-400">獲得したポイントで様々な報酬と交換できます</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">ダッシュボード</h3>
            <p className="text-gray-400">システム全体の統計情報を確認できます</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestBoardSystem;
