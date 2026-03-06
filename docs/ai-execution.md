# AI Execution Guide

## Purpose

このファイルは、AI エージェントがこの repo で作業するときの実行フローと報告方針をまとめるための補助ガイドです。

## Reading Order

1. `README.md`
2. `AGENTS.md`
3. `docs/ai-execution.md`
4. 対象機能の実装ファイルや補助資料

## Execution Flow

### 1. Explore

- まず既存実装、既存差分、関連ファイルを確認する
- 前提を決め打ちせず、変更対象と影響範囲を把握する
- ルール確認が必要な場合は `AGENTS.md` を優先する

### 2. Plan

- 変更が複数ファイルにまたがる場合は作業順を明確にする
- issue 単位で branch を分け、必要なら `git worktree` を使う
- unrelated な変更を混ぜない

### 3. Implement

- 手動編集は `apply_patch` を優先する
- source-of-truth docs を増やしすぎず、役割分担を明確にする
- prompt はルール本文の複製ではなく入口に寄せる

### 4. Validate

- 可能な範囲で lint、typecheck、test、build を実行する
- 実行できなかった検証や既存不具合による失敗は必ず残す
- docs 変更でも、少なくとも参照切れや重複を確認する

### 5. Report

- 進捗共有は短く具体的に行う
- final では変更結果、検証、未解決リスクを分けて伝える
- review 依頼時は findings first を守る

## Reporting Expectations

- 作業中: 何を見ているか、何をこれから変えるかを簡潔に共有する
- 実装後: 変更内容、検証結果、未実施項目を明記する
- 不確実な判断: 推測であることと根拠を明記する

## Validation Checklist

- 参照ファイルやリンクが古くなっていない
- ルールが複数ファイルで矛盾していない
- 新しい source-of-truth を作った場合、既存 docs の役割と競合していない
