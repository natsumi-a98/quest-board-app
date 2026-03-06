社内掲示板アプリの改善Issueを作成してください。

ただし、新規Issueを作成する前に既存Issueを確認してください。

---

# Step1: 既存Issueの取得

まず以下のコマンドを実行して既存Issueを取得してください。

gh issue list --limit 200 --json number,title,body,labels

必要に応じて以下で詳細を確認してください。

gh issue view <issue-number>

---

# Step2: Issue分析

既存Issueを分析し、以下を整理してください。

- 既にカバーされている領域
- 未カバーの領域
- 改善余地がある領域

ルール

- 既存Issueと重複するIssueは作らない
- 類似Issueがある場合は新規Issueではなく拡張提案にする
- 未カバー領域を中心にIssueを作成する

---

# アプリ概要

社内向け掲示板アプリです。

社員向けにお知らせやナレッジを投稿するシステムです。

主な機能

- 投稿一覧
- 投稿詳細
- 投稿作成 / 編集 / 削除
- カテゴリ / タグ
- 添付ファイル
- 検索
- 既読 / 未読
- 重要投稿（ピン留め）
- 通知
- 管理者機能
- 公開範囲制御

---

# Issueを作る観点

以下の観点からIssueを洗い出してください。

## プロダクト / UX

- UI
- UX
- Accessibility
- Mobile
- Editor
- InformationArchitecture
- Search
- Notification

## セキュリティ / 権限

- Security
- Permission
- Moderation
- AbusePrevention

## データ / システム

- DataModel
- Performance
- ErrorHandling
- Observability
- Logging
- Backup

## 運用 / 管理

- Audit
- Admin
- Testing

---

# Issueタイトルルール

タイトルは必ず以下の形式にしてください。

[カテゴリ] 対象機能 - 改善内容

例

[UI] 投稿一覧 - 重要投稿を視覚的に強調  
[Security] 投稿本文 - XSS対策としてHTMLサニタイズを追加  
[Permission] 投稿編集 - 投稿者以外の編集を禁止  
[Performance] 投稿一覧 - ページネーション導入  
[Search] 投稿検索 - タグ検索機能を追加  
[Notification] 投稿更新 - フォロー投稿の通知を追加  

カテゴリは以下から選択してください。

UI  
UX  
Accessibility  
Mobile  
Editor  
InformationArchitecture  
Search  
Notification  

Security  
Permission  
Moderation  
AbusePrevention  

DataModel  
Performance  
ErrorHandling  
Observability  
Logging  
Backup  

Audit  
Admin  
Testing  

---

# Issue粒度

以下のルールでIssueを作成してください。

- 1 Issue = 1改善テーマ
- 実装者がすぐ着手できる粒度
- 抽象的ではなく具体的な改善内容
- UIの場合は対象画面を明確にする
- APIの場合は対象エンドポイントを明確にする

NG例

「セキュリティを強化する」

OK例

「投稿本文のHTMLをサニタイズしてXSSを防ぐ」

---

# Issue生成ルール

以下のルールでIssueを生成してください。

- 観点ごとに最低3件作成
- 重複Issueは作らない
- 実装可能な粒度にする
- MVPで必要かどうかも判断する

---

# 出力フォーマット

各Issueについて以下を出力してください。

タイトル  

カテゴリ  

背景 / 課題  

対応内容  

受け入れ条件  

優先度（High / Medium / Low）

MVP必須か（Yes / No）

---

# 出力件数

最低60件のIssueを作成してください。