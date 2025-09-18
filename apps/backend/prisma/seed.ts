import prisma from "../src/lib/prisma";

async function main() {
  // ---------------------
  // データリセット（外部キー依存関係の順序で削除）
  // ---------------------
  await prisma.questParticipant.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.clearSubmission.deleteMany();
  await prisma.incentivePayment.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.reward.deleteMany(); // reward が quest を参照している
  await prisma.quest.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------
  // サンプルユーザー作成
  // ---------------------
  const userTaro = await prisma.user.create({
    data: { name: "佐藤太郎", email: "taro@example.com", role: "member" },
  });

  const userHanako = await prisma.user.create({
    data: { name: "田中花子", email: "hanako@example.com", role: "member" },
  });

  const userJiro = await prisma.user.create({
    data: { name: "鈴木次郎", email: "jiro@example.com", role: "member" },
  });

  const userAsato = await prisma.user.create({
    data: { name: "安里なつみ", email: "asato@example.com", role: "member" },
  });

  // ---------------------
  // クエスト4件作成
  // ---------------------
  const quest1 = await prisma.quest.create({
    data: {
      title: "新しいAPI設計の勇者求む",
      description:
        "RESTful APIの設計・実装を通じて、システム設計スキルを向上させよう！",
      type: "development",
      status: "active",
      maxParticipants: 10,
      tags: ["API", "設計", "バックエンド"],
      start_date: new Date("2025-07-01T00:00:00Z"),
      end_date: new Date("2025-07-15T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 50000,
          point_amount: 500,
          note: "API設計完了時のボーナス報酬",
        },
      },
      quest_participants: {
        create: [
          { user: { connect: { id: userTaro.id } } },
          { user: { connect: { id: userHanako.id } } },
        ],
      },
    },
  });

  const quest2 = await prisma.quest.create({
    data: {
      title: "UI/UX改善の冒険者募集",
      description:
        "既存アプリのデザインを改善して、より直感的で使いやすいUIを目指そう。",
      type: "design",
      status: "in_progress",
      maxParticipants: 8,
      tags: ["TypeScript", "フロントエンド", "学習"],
      start_date: new Date("2025-08-01T00:00:00Z"),
      end_date: new Date("2025-08-20T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 30000,
          point_amount: 300,
          note: "UI改善に貢献したメンバーへの報酬",
        },
      },
      quest_participants: {
        create: [{ user: { connect: { id: userJiro.id } } }],
      },
    },
  });

  const quest3 = await prisma.quest.create({
    data: {
      title: "新規ビジネス企画の仲間を探しています",
      description: "新しいサービスのアイデアを出し合い、事業企画を形にしよう！",
      type: "planning",
      status: "active",
      maxParticipants: 20,
      tags: ["パフォーマンス", "最適化", "フロントエンド"],
      start_date: new Date("2025-09-05T00:00:00Z"),
      end_date: new Date("2025-09-25T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 80000,
          point_amount: 800,
          note: "採用された企画に対する報酬",
        },
      },
      quest_participants: {
        create: [{ user: { connect: { id: userJiro.id } } }],
      },
    },
  });

  const quest4 = await prisma.quest.create({
    data: {
      title: "既存システムのバグ修正チャレンジ",
      description:
        "報告されている不具合を修正し、システムの安定性を向上させよう！",
      type: "maintenance",
      status: "active",
      maxParticipants: 15,
      tags: ["バグ修正", "改善", "バックエンド", "フロントエンド"],
      start_date: new Date("2025-10-01T00:00:00Z"),
      end_date: new Date("2025-10-10T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 20000,
          point_amount: 200,
          note: "修正件数に応じてボーナスあり",
        },
      },
      quest_participants: {
        create: [{ user: { connect: { id: userAsato.id } } }],
      },
    },
  });

  // ---------------------
  // 完了済みクエスト作成
  // ---------------------
  const completedQuest1 = await prisma.quest.create({
    data: {
      title: "React開発スキル向上チャレンジ",
      description:
        "Reactを使用したモダンなWebアプリ開発に挑戦。TypeScriptやHooksを学びます。",
      type: "development",
      status: "completed",
      maxParticipants: 12,
      tags: ["React", "TypeScript", "フロントエンド", "学習"],
      start_date: new Date("2024-11-01T00:00:00Z"),
      end_date: new Date("2024-12-31T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 50000,
          point_amount: 500,
          note: "React開発完了時の報酬",
        },
      },
      quest_participants: {
        create: [
          {
            user: { connect: { id: userTaro.id } },
            completed_at: new Date("2024-12-15T10:00:00Z"),
          },
          {
            user: { connect: { id: userHanako.id } },
            completed_at: new Date("2024-12-20T14:30:00Z"),
          },
          {
            user: { connect: { id: userJiro.id } },
            completed_at: new Date("2024-12-25T09:15:00Z"),
          },
        ],
      },
    },
  });

  const completedQuest2 = await prisma.quest.create({
    data: {
      title: "データベース設計の基礎を学ぶ",
      description:
        "MySQLを使ったデータベース設計とクエリ最適化について学習します。",
      type: "learning",
      status: "completed",
      maxParticipants: 8,
      tags: ["MySQL", "データベース", "設計", "SQL"],
      start_date: new Date("2024-10-01T00:00:00Z"),
      end_date: new Date("2024-11-30T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 30000,
          point_amount: 300,
          note: "データベース設計完了時の報酬",
        },
      },
      quest_participants: {
        create: [
          {
            user: { connect: { id: userAsato.id } },
            completed_at: new Date("2024-11-20T16:45:00Z"),
          },
          {
            user: { connect: { id: userTaro.id } },
            completed_at: new Date("2024-11-25T11:20:00Z"),
          },
        ],
      },
    },
  });

  const completedQuest3 = await prisma.quest.create({
    data: {
      title: "チーム開発ワークフロー習得",
      description:
        "Git、GitHub、CI/CDパイプラインを使ったチーム開発のワークフローを習得します。",
      type: "development",
      status: "completed",
      maxParticipants: 10,
      tags: ["Git", "GitHub", "CI/CD", "チーム開発"],
      start_date: new Date("2024-09-01T00:00:00Z"),
      end_date: new Date("2024-10-31T23:59:59Z"),
      rewards: {
        create: {
          incentive_amount: 40000,
          point_amount: 400,
          note: "チーム開発ワークフロー習得完了時の報酬",
        },
      },
      quest_participants: {
        create: [
          {
            user: { connect: { id: userHanako.id } },
            completed_at: new Date("2024-10-15T13:30:00Z"),
          },
          {
            user: { connect: { id: userJiro.id } },
            completed_at: new Date("2024-10-20T15:45:00Z"),
          },
          {
            user: { connect: { id: userAsato.id } },
            completed_at: new Date("2024-10-25T10:15:00Z"),
          },
        ],
      },
    },
  });

  // ---------------------
  // レビューデータ作成
  // ---------------------
  // React開発スキル向上チャレンジのレビュー
  await prisma.review.createMany({
    data: [
      {
        reviewer_id: userTaro.id,
        quest_id: completedQuest1.id,
        rating: 5,
        comment:
          "ReactとTypeScriptの理解が深まりました！とても勉強になりました。",
        created_at: new Date("2024-12-16T10:30:00Z"),
      },
      {
        reviewer_id: userHanako.id,
        quest_id: completedQuest1.id,
        rating: 4,
        comment:
          "Hooksの使い方がよく分かりました。実践的な内容で良かったです。",
        created_at: new Date("2024-12-21T15:45:00Z"),
      },
      {
        reviewer_id: userJiro.id,
        quest_id: completedQuest1.id,
        rating: 5,
        comment: "モダンなReact開発の流れを学べて大変有意義でした。",
        created_at: new Date("2024-12-26T09:20:00Z"),
      },
    ],
  });

  // データベース設計の基礎を学ぶのレビュー
  await prisma.review.createMany({
    data: [
      {
        reviewer_id: userAsato.id,
        quest_id: completedQuest2.id,
        rating: 4,
        comment: "MySQLの設計パターンが理解できました。実務で活かせそうです。",
        created_at: new Date("2024-11-21T17:00:00Z"),
      },
      {
        reviewer_id: userTaro.id,
        quest_id: completedQuest2.id,
        rating: 5,
        comment:
          "クエリ最適化の手法が学べて、パフォーマンス改善に役立ちました。",
        created_at: new Date("2024-11-26T12:15:00Z"),
      },
    ],
  });

  // チーム開発ワークフロー習得のレビュー
  await prisma.review.createMany({
    data: [
      {
        reviewer_id: userHanako.id,
        quest_id: completedQuest3.id,
        rating: 5,
        comment: "Gitのブランチ戦略やCI/CDの設定方法が詳しく学べました。",
        created_at: new Date("2024-10-16T14:00:00Z"),
      },
      {
        reviewer_id: userJiro.id,
        quest_id: completedQuest3.id,
        rating: 4,
        comment: "チーム開発のベストプラクティスが理解できました。",
        created_at: new Date("2024-10-21T16:30:00Z"),
      },
      {
        reviewer_id: userAsato.id,
        quest_id: completedQuest3.id,
        rating: 5,
        comment: "GitHub Actionsを使った自動化の仕組みが勉強になりました。",
        created_at: new Date("2024-10-26T11:45:00Z"),
      },
    ],
  });

  console.log("Seed completed:", {
    quest1: quest1.title,
    quest2: quest2.title,
    quest3: quest3.title,
    quest4: quest4.title,
    completedQuest1: completedQuest1.title,
    completedQuest2: completedQuest2.title,
    completedQuest3: completedQuest3.title,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
