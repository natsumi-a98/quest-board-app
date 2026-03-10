# AI Agent Rules

このリポジトリで作業する AI エージェントは、このファイルを最優先の共通ルールとして扱う。

## 参照順序

作業開始時の参照順序:

1. ユーザーの最新依頼
2. `README.md`
3. `AGENTS.md`
4. `docs/architecture.md`
5. `docs/ai-execution.md`
6. `prompt/agent.md`
7. 関連コード / 関連テスト

判断が衝突した場合の優先順位:

1. ユーザーの最新依頼
2. `AGENTS.md`
3. `docs/ai-execution.md`
4. `docs/architecture.md`
5. `README.md`
6. 補助 prompt / 互換 docs

## 責務

- このファイルは AI エージェント共通ルールのみを定義する
- システム構造とレイヤー責務は `docs/architecture.md` に集約する
- 実行フローと検証方針は `docs/ai-execution.md` に集約する
- 他エージェント向けの短い依頼テンプレートは `prompt/agent.md` に置く
- セットアップや repo 全体像は `README.md` を正本とする

## General

- 返答、レビューコメント、PR 本文は日本語で記述する。
- まず既存実装と既存差分を確認し、前提を決め打ちしない。
- ユーザーが作成した未コミット差分は勝手に戻さない。
- 破壊的コマンドは、明示的な依頼または承認がある場合のみ実行する。
- 調査せずに質問してはならない。
- 不明点がある場合でも、まず既存コードから仮説を立てて進める。
- ドキュメント間で矛盾がある場合は、ユーザー指示を除きこのファイルを優先する。

## Git / Branch

- issue 対応は原則 `git worktree` で分離する。
- 作業ブランチは 1 issue / 1 task ごとに切る。
- 既存 PR がマージ済みの場合は、必要に応じて新しいブランチと PR を作り直す。
- push 前に upstream との差分と競合有無を確認する。

## Editing

- 手動編集は `apply_patch` を使う。
- 変更は必要最小限にとどめる。
- unrelated な修正を混ぜない。
- frontend / backend / docs をまたぐ変更は、なぜまたぐ必要があるかを説明する。

## Validation

- 実装後は、可能な範囲でテスト、型チェック、ビルドを実行する。
- 実装を行った場合は単体テストを追加する。
- 実行できなかった検証や、既存不具合で失敗した検証は必ず明記する。
- pre-commit は軽い差分検証に限定する。
- pre-push は重いローカル検証に使う。
- CI はリポジトリ全体の最終保証とする。

## Review

- レビューは findings first で書く。
- 指摘は severity を意識し、根拠ファイルを示す。
- 問題がなければ「追加指摘なし」を明示する。
- 推測を含む場合は、その旨を明記する。

## Issue / PR

- issue タイトルは対象と目的が判別できる具体的な文言にする。
- issue 本文には少なくとも `Summary` `Background` `Scope` `Acceptance Criteria` を含める。
- PR 本文には少なくとも `Summary` と `Verification` を含める。
- 影響範囲が広い場合は `Risks` か `Notes` を追記する。
- hook や CI による既存失敗がある場合は、今回変更と既存失敗を切り分けて書く。
