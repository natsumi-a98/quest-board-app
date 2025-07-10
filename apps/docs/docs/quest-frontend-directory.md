# クエスト掲示板アプリケーション設計方針

## 使用技術
- フロントエンド：React, TypeScript, Next.js
- コンポーネント設計：Atomic Design（テンプレート層は除く）

---

## 1. フロントエンド ディレクトリ構成案

```plaintext
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── quests/
│   │   ├── mypage/
│   │   └── admin/
│   │       ├── dashboard.tsx
│   │       ├── quests.tsx
│   │       ├── rewards.tsx
│   │       ├── users.tsx
│   │       └── roles.tsx
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   ├── features/
│   ├── layouts/
│   ├── hooks/ usehooksとかまとめること
│   ├── utils/
│   ├── services/ ←utilsとまとめて良いかも
│   ├── types/
│   └── store/
├── .env.local
├── next.config.js
└── tsconfig.json

---

## 2. コンポーネント設計方針（Atomic Design準拠）

本アプリケーションでは Atomic Design に基づき、次の3つのレイヤーを採用します（Template は採用しません）。

### レイヤー構成

| レイヤー     | 説明                                 | 例                               |
| ------------ | ------------------------------------ | -------------------------------- |
| **Atom**     | UIの最小単位。再利用性が高い。       | `Button`, `TextInput`, `Icon`    |
| **Molecule** | 複数のAtomを組み合わせた部品。       | `LoginForm`, `QuestCard`         |
| **Organism** | 機能としてまとまったコンポーネント。 | `Header`, `Sidebar`, `QuestList` |

### ディレクトリ構成例（components）

src/
└── components/
    ├── atoms/
    │   ├── Button.tsx
    │   ├── TextInput.tsx
    │   └── Icon.tsx
    ├── molecules/
    │   ├── LoginForm.tsx
    │   └── QuestCard.tsx
    └── organisms/
        ├── Header.tsx
        ├── QuestList.tsx
        └── Sidebar.tsx

---

## 3. 画面構成一覧

### 3.1 一般ユーザー用画面
- ログイン画面
- ホーム画面
- クエスト一覧画面
- マイページ
- 過去のクエスト一覧画面
- ポイント交換所画面（将来的に実装予定）

### 3.2 管理者用画面
- ダッシュボード
- クエスト管理画面
- 報酬管理画面
- ユーザー管理画面
- ロール・権限管理画面

---

## 4. コンポーネント構成例

本セクションでは、Atomic Design に基づくコンポーネント構成の具体例を画面ごとに示します。

### 一般ユーザー向け画面：クエスト一覧画面
pages/quests/index.tsx
 └─ <QuestList /> (organism)
     └─ <QuestCard /> (molecule)
         ├─ <Title /> (atom)
         ├─ <Description /> (atom)
         ├─ <TagList /> (molecule)
         │   └─ <Tag /> (atom)
         └─ <ActionButton /> (atom)

### 一般ユーザー向け画面：マイページ
pages/mypage/index.tsx
 └─ <UserProfile /> (organism)
     ├─ <Avatar /> (atom)
     ├─ <UserInfo /> (molecule)
     │   ├─ <UserName /> (atom)
     │   └─ <UserPoints /> (atom)
     └─ <QuestHistory /> (organism)
         └─ <QuestCard /> (molecule)

### 管理者画面：ユーザー管理画面
pages/admin/users.tsx
 └─ <UserTable /> (organism)
     └─ <UserRow /> (molecule)
         ├─ <UserName /> (atom)
         ├─ <Email /> (atom)
         └─ <RoleBadge /> (atom)

### 管理者画面：クエスト管理画面
pages/admin/quests.tsx
 └─ <AdminQuestList /> (organism)
     └─ <AdminQuestCard /> (molecule)
         ├─ <QuestTitle /> (atom)
         ├─ <RewardPoints /> (atom)
         └─ <EditButton /> (atom)

### 共通レイアウト構成
src/layouts/
 └─ <MainLayout />
     ├─ <Header /> (organism)
     ├─ <Sidebar /> (organism)
     └─ <Footer /> (organism)

---
