/**
 * クエストのステータス
 */
export enum QuestStatus {
  /** アクティブなクエスト */
  Active = "active",
  /** 進行中のクエスト */
  InProgress = "in_progress",
  /** 停止中のクエスト */
  Inactive = "inactive",
  /** 完了したクエスト */
  Completed = "completed",
}

/**
 * クエストの難易度
 */
export enum QuestDifficulty {
  /** 初級 */
  Beginner = "初級",
  /** 中級 */
  Intermediate = "中級",
  /** 上級 */
  Advanced = "上級",
}

/**
 * クエストのタイプ
 */
export enum QuestType {
  /** 開発系クエスト */
  Development = "development",
  /** 学習系クエスト */
  Learning = "learning",
  /** チャレンジ系クエスト */
  Challenge = "challenge",
}

/**
 * アイコン（自由追加可）
 */
export enum QuestIcon {
  /** 本のアイコン */
  Book = "Book",
  /** 剣のアイコン */
  Sword = "Sword",
  /** レンチのアイコン */
  Wrench = "Wrench",
}

/**
 * クエスト参加者情報
 */
export interface QuestParticipant {
  /** 参加ユーザー */
  user: {
    /** ユーザー名 */
    name: string;
  };
  /** 参加日時（ISO8601） */
  joined_at: string;
  /** 完了日時（ISO8601、省略可） */
  completed_at?: string;
}

/**
 * クエスト情報
 */
export interface Quest {
  /** クエストID */
  id: number;
  /** クエストタイトル */
  title: string;
  /** クエスト説明 */
  description: string;
  /** クエストタイプ */
  type: QuestType;
  /** ステータス */
  status: QuestStatus;
  /** 開始日（ISO8601） */
  start_date: string;
  /** 終了日（ISO8601） */
  end_date: string;
  /** 作成日時（ISO8601） */
  created_at: string;
  /** 更新日時（ISO8601） */
  updated_at: string;
  /** 報酬情報 */
  rewards: {
    /** インセンティブ金額 */
    incentive_amount: number;
    /** ポイント数 */
    point_amount: number;
    /** 備考 */
    note: string;
  };
  /** 参加者リスト */
  quest_participants: QuestParticipant[];
  /** 参加者数カウント */
  _count: {
    /** 参加者数 */
    quest_participants: number;
  };
  /** 最大参加人数 */
  maxParticipants: number;
  /** タグリスト */
  tags: string[];
  /** 難易度 */
  difficulty: QuestDifficulty;
  /** アイコン */
  icon: QuestIcon;
}
