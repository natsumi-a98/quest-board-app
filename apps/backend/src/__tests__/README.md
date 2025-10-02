# テストファイル

このディレクトリには、quest-board-appのバックエンドサービスのテストファイルが含まれています。

## テストの実行方法

### 全テストの実行
```bash
pnpm test
```

### ウォッチモードでテストを実行
```bash
pnpm run test:watch
```

### カバレッジレポート付きでテストを実行
```bash
pnpm run test:coverage
```

## テストファイル構成

- `setup.ts` - Jestの初期設定
- `mocks/` - モックファイル
  - `QuestDataAccessor.mock.ts` - QuestDataAccessorのモック実装
- `services/` - サービスクラスのテスト
  - `questService.test.ts` - questServiceのテスト

## テストの特徴

- **モック化**: データベースアクセス層（QuestDataAccessor）をモック化して、実際のデータベースに依存しないテストを実装
- **包括的**: 正常系、異常系、エラーハンドリングのテストケースを網羅
- **型安全**: TypeScriptの型定義を活用した型安全なテスト
- **カバレッジ**: コードカバレッジレポートを生成
