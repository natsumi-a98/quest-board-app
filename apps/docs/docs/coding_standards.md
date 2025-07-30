# クエスト掲示板アプリケーション - コーディング規約

## 📋 目次

1. [概要](#概要)
2. [共通規約](#共通規約)
3. [フロントエンド規約](#フロントエンド規約)
4. [バックエンド規約](#バックエンド規約)
5. [データベース規約](#データベース規約)
6. [API設計規約](#api設計規約)
7. [Git規約](#git規約)

---

## 🎯 概要

本規約は、クエスト掲示板アプリケーションの開発において、コード品質の向上と保守性の確保を目的としています。

### 使用技術
- **フロントエンド**: React, TypeScript, Next.js
- **バックエンド**: Node.js (Express), TypeScript
- **データベース**: MySQL
- **認証**: Firebase Authentication
- **通知**: Slack Webhook
- **パッケージ管理**: pnpm
- **コード整形・Lint**: Biome

---

## 🔧 共通規約

### 言語・エンコーディング
- **文字エンコーディング**: UTF-8
- **改行コード**: LF（Unix形式）
- **インデント**: スペース2文字
- **コメント**: 日本語で記述（API仕様書は英語併記）

### 命名規則
- **ファイル名**: kebab-case（例: `quest-controller.ts`）
- **クラス**: PascalCase（例: `QuestService`）
- **メソッド**: camelCase（例: `createQuest`）
- **変数**: camelCase（例: `questData`）

### コメント規則
```typescript
/**
 * クエスト情報を取得する
 * @param id - クエストID
 * @param userId - ユーザーID（認証済み）
 * @returns クエスト詳細情報
 * @throws {NotFoundError} クエストが存在しない場合
 */
async function getQuest(id: string, userId: string): Promise<QuestDetail> {
  // 実装
}
```

---

## 🎨 フロントエンド規約

### ディレクトリ構成（Atomic Design準拠）
```
src/
├── pages/              # Next.jsページ
│   ├── index.tsx
│   ├── login.tsx
│   ├── quests/
│   ├── mypage/
│   └── admin/
├── components/         # Atomic Design（テンプレート層は除く）
│   ├── atoms/          # ボタン、入力フィールドなど
│   ├── molecules/      # 検索ボックス、カードなど
│   └── organisms/      # ヘッダー、フッターなど
├── features/           # 機能別コンポーネント
├── layouts/            # レイアウトコンポーネント
├── hooks/              # カスタムフック
├── services/           # API呼び出し
├── types/              # 型定義
├── utils/              # ユーティリティ関数
├── store/              # 状態管理
└── constants/          # 定数
```

### 命名規則
- **コンポーネント**: PascalCase（例: `QuestCard`）
- **変数・関数**: camelCase（例: `fetchQuests`）
- **フック**: use + PascalCase（例: `useQuestList`）
- **型**: PascalCase（例: `QuestDetail`）

### コンポーネント設計
```typescript
// ✅ 良い例
interface QuestCardProps {
  quest: Quest;
  onEntry: (questId: string) => void;
  isLoading?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({ 
  quest, 
  onEntry, 
  isLoading = false 
}) => {
  return (
    <div className="quest-card">
      <h3>{quest.title}</h3>
      <button 
        onClick={() => onEntry(quest.id)}
        disabled={isLoading}
      >
        エントリー
      </button>
    </div>
  );
};
```

### フック設計
```typescript
// カスタムフック例
export const useQuestList = (filters?: QuestFilters) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await questService.getQuests(filters);
      setQuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return { quests, loading, error, refetch: fetchQuests };
};
```

### 型定義
```typescript
// types/quest.ts
export interface Quest {
  id: string;
  title: string;
  description: string;
  genre: QuestGenre;
  status: QuestStatus;
  createdAt: Date;
  updatedAt: Date;
  author: User;
}

export type QuestStatus = 'draft' | 'ongoing' | 'completed' | 'cancelled';
export type QuestGenre = 'learning' | 'development' | 'design' | 'business';
```

---

## 🔌 バックエンド規約

### ディレクトリ構成（責務分離）
```
src/
├── controllers/        # リクエスト処理
├── routes/            # エンドポイント定義
├── services/          # ビジネスロジック
├── models/            # DBモデル定義
├── middlewares/       # ミドルウェア
├── utils/             # ユーティリティ
├── types/             # 型定義
├── constants/         # 定数
├── config/            # 設定
├── app.ts             # Express アプリ本体
└── index.ts           # エントリーポイント
```

### 命名規則
- **ファイル名**: kebab-case（例: `quest-service.ts`）
- **ディレクトリ名**: kebab-case（例: `user-management`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`）
- **環境変数**: UPPER_SNAKE_CASE（例: `DATABASE_URL`）

### Controller設計
```typescript
// controllers/quest-controller.ts
export class QuestController {
  constructor(
    private questService: QuestService,
    private logger: Logger
  ) {}

  /**
   * クエスト一覧取得
   */
  async getQuests(req: Request, res: Response): Promise<void> {
    try {
      const filters = this.parseFilters(req.query);
      const quests = await this.questService.getQuests(filters);
      
      res.status(200).json({
        success: true,
        data: quests,
        meta: {
          total: quests.length,
          page: filters.page || 1
        }
      });
    } catch (error) {
      this.logger.error('クエスト一覧取得エラー', error);
      res.status(500).json({
        success: false,
        error: 'クエスト一覧の取得に失敗しました'
      });
    }
  }

  private parseFilters(query: any): QuestFilters {
    return {
      status: query.status,
      genre: query.genre,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 20
    };
  }
}
```

### Service設計
```typescript
// services/quest-service.ts
export class QuestService {
  constructor(
    private questModel: QuestModel,
    private userModel: UserModel,
    private notificationService: NotificationService
  ) {}

  /**
   * クエスト作成
   */
  async createQuest(questData: CreateQuestData, userId: string): Promise<Quest> {
    // バリデーション
    await this.validateQuestData(questData);
    
    // ユーザー存在確認
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError('ユーザーが見つかりません');
    }

    // クエスト作成
    const quest = await this.questModel.create({
      ...questData,
      authorId: userId,
      status: 'draft'
    });

    // 通知送信
    await this.notificationService.sendQuestCreated(quest);

    return quest;
  }

  private async validateQuestData(data: CreateQuestData): Promise<void> {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('タイトルは必須です');
    }
    
    if (data.title.length > 100) {
      throw new ValidationError('タイトルは100文字以内で入力してください');
    }
  }
}
```

### Model設計
```typescript
// models/quest-model.ts
export class QuestModel {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Quest | null> {
    const result = await this.db.query(
      'SELECT * FROM quests WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    
    return result[0] ? this.mapToQuest(result[0]) : null;
  }

  async create(data: CreateQuestData): Promise<Quest> {
    const id = generateId();
    const now = new Date();
    
    await this.db.query(
      `INSERT INTO quests (id, title, description, genre, status, author_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.title, data.description, data.genre, data.status, data.authorId, now, now]
    );
    
    return this.findById(id)!;
  }

  private mapToQuest(row: any): Quest {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      genre: row.genre,
      status: row.status,
      authorId: row.author_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
```

---

## 🗄️ データベース規約

### テーブル命名規則
- **テーブル名**: snake_case + 複数形（例: `quest_entries`）
- **カラム名**: snake_case（例: `created_at`）
- **インデックス名**: `idx_{テーブル名}_{カラム名}`（例: `idx_quests_status`）
- **外部キー名**: `fk_{テーブル名}_{参照テーブル名}`（例: `fk_quests_users`）

### マイグレーション例
```sql
-- クエストテーブル
CREATE TABLE quests (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  genre ENUM('learning', 'development', 'design', 'business') NOT NULL,
  status ENUM('draft', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'draft',
  author_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  INDEX idx_quests_status (status),
  INDEX idx_quests_genre (genre),
  INDEX idx_quests_author_id (author_id),
  INDEX idx_quests_created_at (created_at)
);
```

---

## 🌐 API設計規約

### エンドポイント設計
```
/api/{version}/{resource}/{id?}/{action?}
```

### レスポンス形式
```typescript
// 成功レスポンス
{
  "success": true,
  "data": { /* データ */ },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// エラーレスポンス
{
  "success": false,
  "error": "エラーメッセージ",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "title",
      "message": "タイトルは必須です"
    }
  ]
}
```

### エラーハンドリング
```typescript
// カスタムエラークラス
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// エラーハンドラー
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: 'VALIDATION_ERROR'
    });
  }
  
  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: error.message,
      code: 'NOT_FOUND'
    });
  }
  
  // その他のエラー
  res.status(500).json({
    success: false,
    error: '内部サーバーエラー',
    code: 'INTERNAL_SERVER_ERROR'
  });
};
```

---

## 📝 Git規約

### ブランチ戦略
- **main**: 本番環境用
- **develop**: 開発統合用
- **feature/{機能名}**: 新機能開発用
- **hotfix/{修正内容}**: 緊急修正用

### コミットメッセージ
```
{type}: {subject}

{body}

{footer}
```

#### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイル修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: その他の変更

#### 例
```
feat: クエスト一覧にフィルタ機能を追加

ジャンルとステータスでクエストを絞り込める機能を実装
- フィルタコンポーネントの作成
- API側でのクエリパラメータ対応
- 状態管理の改善

Closes #123
```

---

## 📊 メトリクス・品質管理

### 必須チェック項目
- [ ] TypeScript型エラーなし
- [ ] Biome lintエラーなし
- [ ] 単体テストカバレッジ80%以上
- [ ] APIドキュメント更新済み
- [ ] セキュリティチェック通過

### パフォーマンス指標
- **フロントエンド**: First Contentful Paint < 1.5s
- **バックエンド**: API レスポンス時間 < 200ms
- **データベース**: クエリ実行時間 < 100ms

---

## 🔐 セキュリティ規約

### 認証・認可
- Firebase Authentication必須
- JWTトークン検証をミドルウェアで実装
- ロールベースアクセス制御（RBAC）適用

### データ保護
- 機密情報のログ出力禁止
- SQLインジェクション対策（プリペアードステートメント使用）
- XSS対策（入力値サニタイズ）

### 環境変数管理
```typescript
// ✅ 良い例
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || ''
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || ''
  }
};

// ❌ 悪い例
const config = {
  database: {
    password: 'hardcoded-password' // 絶対にNG
  }
};
```

---

この規約に従うことで、保守性が高く、スケーラブルなアプリケーションを構築できます。
