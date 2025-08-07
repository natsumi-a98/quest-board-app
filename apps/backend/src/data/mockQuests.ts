import {
  Quest,
  QuestStatus,
  QuestDifficulty,
  QuestType,
  QuestIcon,
} from "../models/quest";

export const mockQuests = [
  {
    id: 1,
    title: "新しいAPI設計の勇者求む",
    description:
      "RESTful APIの設計・実装を通じて、システム設計スキルを向上させよう！",
    type: QuestType.Development,
    status: QuestStatus.Active,
    start_date: "2025-07-01T00:00:00Z",
    end_date: "2025-07-15T23:59:59Z",
    created_at: "2025-06-15T09:00:00Z",
    updated_at: "2025-06-20T14:30:00Z",
    rewards: {
      incentive_amount: 50000,
      point_amount: 500,
      note: "API設計完了時のボーナス報酬",
    },
    quest_participants: [
      { user: { name: "佐藤太郎" }, joined_at: "2025-06-16T10:00:00Z" },
      { user: { name: "田中花子" }, joined_at: "2025-06-17T15:30:00Z" },
    ],
    _count: {
      quest_participants: 2,
    },
    maxParticipants: 3,
    tags: ["API", "設計", "バックエンド"],
    difficulty: QuestDifficulty.Intermediate,
    icon: QuestIcon.Wrench,
  },
  {
    id: 2,
    title: "TypeScript修行の旅",
    description:
      "TypeScriptの型安全性を学び、より堅牢なコードを書けるようになろう",
    type: QuestType.Learning,
    status: QuestStatus.Active,
    start_date: "2025-06-01T00:00:00Z",
    end_date: "2025-06-30T23:59:59Z",
    created_at: "2025-05-20T09:00:00Z",
    updated_at: "2025-06-25T16:20:00Z",
    rewards: {
      incentive_amount: 30000,
      point_amount: 300,
      note: "学習完了時の報酬",
    },
    quest_participants: [
      { user: { name: "山田次郎" }, joined_at: "2025-06-02T09:00:00Z" },
      { user: { name: "鈴木一郎" }, joined_at: "2025-06-03T11:00:00Z" },
      { user: { name: "高橋美咲" }, joined_at: "2025-06-05T14:00:00Z" },
      { user: { name: "伊藤健太" }, joined_at: "2025-06-07T16:00:00Z" },
    ],
    _count: {
      quest_participants: 4,
    },
    maxParticipants: 5,
    tags: ["TypeScript", "フロントエンド", "学習"],
    difficulty: QuestDifficulty.Beginner,
    icon: QuestIcon.Book,
  },
  {
    id: 3,
    title: "パフォーマンス最適化の聖戦",
    description:
      "Webアプリケーションのパフォーマンス改善に挑戦！UXを向上させよう",
    type: QuestType.Challenge,
    status: QuestStatus.Active,
    start_date: "2025-07-01T00:00:00Z",
    end_date: "2025-08-10T23:59:59Z",
    created_at: "2025-06-20T09:00:00Z",
    updated_at: "2025-06-22T10:15:00Z",
    rewards: {
      incentive_amount: 80000,
      point_amount: 800,
      note: "パフォーマンス改善達成時の高額報酬",
    },
    quest_participants: [
      { user: { name: "中村智子" }, joined_at: "2025-06-21T13:00:00Z" },
    ],
    _count: {
      quest_participants: 1,
    },
    maxParticipants: 2,
    tags: ["パフォーマンス", "最適化", "フロントエンド"],
    difficulty: QuestDifficulty.Advanced,
    icon: QuestIcon.Sword,
  },
  {
    id: 4,
    title: "セキュリティの守護者",
    description:
      "セキュリティベストプラクティスを学び、安全なアプリケーションの開発手法を身につけよう",
    type: QuestType.Learning,
    status: QuestStatus.Completed,
    start_date: "2025-05-01T00:00:00Z",
    end_date: "2025-05-31T23:59:59Z",
    created_at: "2025-04-15T09:00:00Z",
    updated_at: "2025-06-01T09:00:00Z",
    rewards: {
      incentive_amount: 60000,
      point_amount: 600,
      note: "セキュリティ学習完了報酬",
    },
    quest_participants: [
      {
        user: { name: "小林達也" },
        joined_at: "2025-05-02T10:00:00Z",
        completed_at: "2025-05-30T18:00:00Z",
      },
      {
        user: { name: "渡辺さくら" },
        joined_at: "2025-05-03T11:00:00Z",
        completed_at: "2025-05-29T17:30:00Z",
      },
      {
        user: { name: "松本雄介" },
        joined_at: "2025-05-05T09:30:00Z",
        completed_at: "2025-05-31T16:45:00Z",
      },
    ],
    _count: {
      quest_participants: 3,
    },
    maxParticipants: 4,
    tags: ["セキュリティ", "学習", "ベストプラクティス"],
    difficulty: QuestDifficulty.Intermediate,
    icon: QuestIcon.Book,
  },
];
