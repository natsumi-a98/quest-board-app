# Agent Prompt Template

このテンプレートは、実装開始時に source-of-truth docs を最初に参照させるための最小プロンプトです。

## Read First

1. `README.md`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `docs/architecture.md` が存在する場合は確認する
5. `docs/ai-execution.md` が存在する場合は確認する

## Working Rules

- まず既存実装と既存差分を確認する
- ルール判断は `AGENTS.md` を優先する
- prompt にはルール本文を複製せず、source-of-truth docs を参照する
- 実装後は検証結果と未実施項目を明記する

## Usage

必要に応じて以下をそのまま起動文として使う。

```md
README.md と AGENTS.md を先に確認し、必要なら CLAUDE.md と関連 docs を補助的に参照してください。
まず既存実装と既存差分を把握し、前提を決め打ちせずに進めてください。
変更は issue 単位で最小限に留め、実装後は検証結果と未実施項目を報告してください。
```
