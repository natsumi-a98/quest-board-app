# クエスト掲示板アプリケーション - レビュー規約

## 📋 目次

1. [概要](#概要)
2. [レビュープロセス](#レビュープロセス)
3. [レビュー観点](#レビュー観点)
4. [チェックリスト](#チェックリスト)
5. [レビューコメント規約](#レビューコメント規約)
6. [承認基準](#承認基準)

---

## 🎯 概要

本レビュー規約は、クエスト掲示板アプリケーションの開発において、コード品質の向上とチーム内での知識共有を目的として策定されています。

### 基本原則
- **建設的なフィードバック**: 問題点だけでなく、改善提案を含める
- **知識共有**: レビューを通じてチーム全体のスキル向上を図る
- **品質確保**: バグの早期発見と設計の改善
- **効率性**: 適切な粒度でのレビュー実施

---

## 🔄 レビュープロセス

### 1. プルリクエスト作成
```markdown
## 概要
クエスト一覧画面にフィルタ機能を追加

## 変更内容
- [ ] フィルタコンポーネントの実装
- [ ] API側でのクエリパラメータ対応
- [ ] 状態管理の改善
- [ ] 単体テストの追加

## 確認事項
- [ ] 既存テストが通ることを確認
- [ ] 新機能のテストを追加
- [ ] TypeScript型エラーなし
- [ ] Biome lintエラーなし

## 関連Issue
Closes #123

## スクリーンショット
![フィルタ機能](./screenshots/filter-feature.png)
```

### 2. レビュー依頼
- **最低2名**のレビュワーを指定

### 3. レビュー実施
- **24時間以内**に初回レビューを実施
- **コメント対応後48時間以内**に再レビューを実施

### 4. 承認・マージ
- 全レビュワーの承認後にマージ可能
- CI/CDパイプラインの通過が必須

---

## 👀 レビュー観点

### 🎨 フロントエンド観点

#### 1. コンポーネント設計
```typescript
// ✅ 良い例
interface QuestCardProps {
  quest: Quest;
  onEntry: (questId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const QuestCard: React.FC<QuestCardProps> = React.memo(({ 
  quest, 
  onEntry, 
  isLoading = false,
  className = '' 
}) => {
  const handleEntry = useCallback(() => {
    onEntry(quest.id);
  }, [quest.id, onEntry]);

  return (
    <div className={`quest-card ${className}`}>
      <h3>{quest.title}</h3>
      <button 
        onClick={handleEntry}
        disabled={isLoading}
        aria-label={`${quest.title}にエントリー`}
      >
        {isLoading ? '処理中...' : 'エントリー'}
      </button>
    </div>
  );
});
```

**チェックポイント:**
- [ ] 適切なPropsの型定義
- [ ] デフォルト値の設定
- [ ] React.memoの適切な使用
- [ ] useCallbackによる不要な再レンダリング防止
- [ ] レスポンシブ対応

#### 2. 状態管理
```typescript
// ✅ 良い例
export const useQuestList = (filters?: QuestFilters) => {
  const [state, setState] = useState<{
    quests: Quest[];
    loading: boolean;
    error: string | null;
  }>({
    quests: [],
    loading: false,
    error: null
  });

  const fetchQuests = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const quests = await questService.getQuests(filters);
      setState(prev => ({ ...prev, quests, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'エラーが発生しました'
      }));
    }
  }, [filters]);

  return { ...state, refetch: fetchQuests };
};
```

**チェックポイント:**
- [ ] 適切な状態の粒度
- [ ] エラーハンドリングの実装
- [ ] ローディング状態の管理
- [ ] 依存配列の最適化

#### 3. パフォーマンス
**チェックポイント:**
- [ ] 開発者ツールで表示される警告等を解消する

### 🔌 バックエンド観点

#### 1. API設計
```typescript
// ✅ 良い例
export class QuestController {
  /**
   * クエスト一覧取得
   * GET /api/quests
   */
  async getQuests(req: Request, res: Response): Promise<void> {
    try {
      // バリデーション
      const filters = await this.validateFilters(req.query);
      
      // 認証チェック
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '認証が必要です',
          code: 'UNAUTHORIZED'
        });
      }

      // ビジネスロジック実行
      const result = await this.questService.getQuests(filters, userId);
      
      res.status(200).json({
        success: true,
        data: result.quests,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit
        }
      });
    } catch (error) {
      await this.handleError(error, req, res);
    }
  }

  private async validateFilters(query: any): Promise<QuestFilters> {
    const schema = Joi.object({
      status: Joi.string().valid('draft', 'ongoing', 'completed', 'cancelled'),
      genre: Joi.string().valid('learning', 'development', 'design', 'business'),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20)
    });

    const { error, value } = schema.validate(query);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    
    return value;
  }
}
```

**チェックポイント:**
- [ ] 適切なHTTPステータスコードの使用
- [ ] 入力値バリデーションの実装
- [ ] 認証・認可の確認
- [ ] エラーハンドリングの実装
- [ ] 統一されたレスポンス形式

#### 2. Service設計
```typescript
// ✅ 良い例
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

**チェックポイント:**
- [ ] 適切な依存関係の注入
- [ ] ビジネスロジックの適切な分離
- [ ] バリデーションの実装
- [ ] エラーハンドリングの実装
- [ ] 外部サービスとの連携

#### 4. セキュリティ
**チェックポイント:**
- [ ] 認証・認可の実装
- [ ] 機密情報のログ出力禁止（Exception：例外を考慮する）
- [ ] 入力値のサニタイズ
- [ ] レート制限の実装

### 🗄️ データベース観点

#### マイグレーション
```sql
-- ✅ 良い例
-- 2024-01-15-create-quest-submissions-table.sql
CREATE TABLE quest_submissions (
  id VARCHAR(36) PRIMARY KEY,
  quest_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  submission_url VARCHAR(2048),
  comment TEXT,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 外部キー制約
  CONSTRAINT fk_quest_submissions_quest_id 
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
  CONSTRAINT fk_quest_submissions_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- インデックス
  INDEX idx_quest_submissions_quest_id (quest_id),
  INDEX idx_quest_submissions_user_id (user_id),
  INDEX idx_quest_submissions_status (status),
  
  -- 複合インデックス
  UNIQUE INDEX uk_quest_submissions_quest_user (quest_id, user_id)
);
```

**チェックポイント:**
- [ ] 適切なデータ型の選択
- [ ] 外部キー制約の設定
- [ ] 必要なインデックスの作成
- [ ] 命名規則の準拠

---

## ✅ チェックリスト

### 共通チェック項目
- [ ] **機能要件**: 仕様通りに動作するか
- [ ] **型安全性**: TypeScriptエラーがないか
- [ ] **テスト（単体）**: 適切なテストが書かれているか
- [ ] **ドキュメント**: 必要な場合、ドキュメントが更新されているか
- [ ] **パフォーマンス**: 性能劣化がないか　×
- [ ] **セキュリティ**: セキュリティ上の問題がないか　×

### フロントエンド固有
- [ ] **Atomic Design**: 適切な粒度でコンポーネントが作られているか（テンプレート層は除く）
- [ ] **アクセシビリティ**: WAI-ARIA準拠しているか
- [ ] **レスポンシブ**: モバイル対応されているか
- [ ] **状態管理**: 適切にフックが使用されているか
- [ ] **エラーハンドリング**: ユーザーに適切なエラーメッセージが表示されるか

### バックエンド固有
- [ ] **API設計**: RESTful APIの原則に従っているか
- [ ] **アーキテクチャ**: Controller → Service → Model の責務分離ができているか
- [ ] **データベース**: 適切なクエリが書かれているか
- [ ] **認証**: 適切な認証・認可が実装されているか
- [ ] **ログ**: 適切なログが出力されているか　×
- [ ] **エラーハンドリング**: 適切なエラーハンドリングが実装されているか　×
