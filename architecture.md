# Architecture

このドキュメントは、このリポジトリのアーキテクチャと実装ルールを定義します。

---

# システム概要

クエスト掲示板は以下の構成で動作します。

Frontend (Next.js)
↓
Backend API (Express)
↓
Service Layer
↓
Prisma ORM
↓
MySQL

認証は Firebase Authentication を使用します。

---

# モノレポ構造

repo
├ apps
│ ├ frontend   # Next.js UI
│ ├ backend    # Express API
│ └ docs       # ドキュメント
│
├ prisma        # Prisma schema
└ docker        # MySQL container

---

# Backend Architecture

Router
↓
Controller
↓
Service
↓
Prisma
↓
MySQL

---

## Router

- APIルーティング
- Controller 呼び出し

---

## Controller

- Request / Response 処理
- Validation
- Service 呼び出し

---

## Service

- ビジネスロジック
- Prisma呼び出し

---

# Frontend Architecture

UI Component
↓
API Client
↓
Backend API

---

# Implementation Rules

新しい機能を実装する場合

1. Prisma schema
2. Service
3. Controller
4. Router
5. Frontend API
6. UI

---

# AI Agent Note

AIエージェントは以下の順序でドキュメントを確認してください。

1. README.md
2. AGENT.md
3. docs/architecture.md
4. 既存コード
