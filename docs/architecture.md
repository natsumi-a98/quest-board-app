# Repository Architecture

## Purpose

このファイルは、AI エージェントと開発者が repo 全体の責務境界を素早く把握するための最小限の architecture ガイドです。

## Repository Shape

- `apps/frontend`: Next.js ベースの UI と画面ロジック
- `apps/backend`: Express / Prisma ベースの API とデータアクセス
- `apps/docs`: ユーザー / 開発者向けのプロダクト関連ドキュメント
- `packages/types`: frontend / backend で共有する型定義
- `prompt`: Issue 作成や整理など、再利用するプロンプト
- `AGENTS.md`: 作業ルールと運用方針の source of truth

## Responsibility Boundaries

### frontend

- 画面表示、ユーザー入力、クライアント側状態管理を担当する
- API 契約は backend と shared types に従う
- UI 変更時は `apps/frontend/src/components` と関連 page / service を起点に確認する

### backend

- 認証、認可、ビジネスロジック、DB アクセスを担当する
- `route -> controller -> service -> data accessor` の流れを基本に追う
- 永続化仕様は Prisma schema と migration を確認する

### shared types

- frontend / backend 間で揃えるべき型の source of truth
- 片側だけでローカル再定義が増えていないかを確認する起点

### docs and prompt

- `apps/docs` はプロダクト / 実装補助の説明資料
- `prompt` は実行用テキストのテンプレート置き場
- ルール本文を重複して持つのではなく、source-of-truth docs への入口に寄せる

## Source Of Truth

- 作業ルール: `AGENTS.md`
- repo 概要とセットアップ: `README.md`
- frontend 構成の補助資料: `apps/docs/quest-frontend-directory.md`
- backend 構成の補助資料: `apps/docs/quest-backend-directory.md`
- 型共有の起点: `packages/types/src/index.ts`

## Recommended Reading Order

1. `README.md`
2. `AGENTS.md`
3. `docs/architecture.md`
4. 対象レイヤーの補助資料や実装ファイル

## Change Entry Points

- UI 改修: `apps/frontend/src/app`, `apps/frontend/src/components`, `apps/frontend/src/services`
- API 改修: `apps/backend/src/routes`, `apps/backend/src/controllers`, `apps/backend/src/services`
- DB / モデル改修: `apps/backend/prisma/schema.prisma`, `apps/backend/prisma/migrations`
- プロンプト / AI docs 改修: `README.md`, `AGENTS.md`, `CLAUDE.md`, `prompt`
