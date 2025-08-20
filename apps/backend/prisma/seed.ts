import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
      status: "active",
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

  console.log("Seed completed:", {
    quest1: quest1.title,
    quest2: quest2.title,
    quest3: quest3.title,
    quest4: quest4.title,
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
