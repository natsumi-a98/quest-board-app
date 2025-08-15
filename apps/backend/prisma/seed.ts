import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.pointTransaction.deleteMany();
  await prisma.incentivePayment.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.clearSubmission.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.questParticipant.deleteMany();
  await prisma.review.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: '田中太郎',
        email: 'tanaka@example.com',
        role: 'quest_creator',
      },
    }),
    prisma.user.create({
      data: {
        name: '佐藤花子',
        email: 'sato@example.com',
        role: 'quest_participant',
      },
    }),
    prisma.user.create({
      data: {
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        role: 'quest_participant',
      },
    }),
    prisma.user.create({
      data: {
        name: '高橋美咲',
        email: 'takahashi@example.com',
        role: 'admin',
      },
    }),
  ]);

  console.log('👥 Created users');

  // Create rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        incentive_amount: 5000.00,
        point_amount: 100,
        note: '初回クエスト達成報酬',
      },
    }),
    prisma.reward.create({
      data: {
        incentive_amount: 10000.00,
        point_amount: 200,
        note: '上級クエスト達成報酬',
      },
    }),
  ]);

  console.log('💰 Created rewards');

  // Create quests
  const quests = await Promise.all([
    prisma.quest.create({
      data: {
        title: '初回クエスト: アプリの基本操作を学ぼう',
        description: 'Quest Boardアプリの基本的な操作方法を学習し、最初のクエストを完了しましょう。',
        type: 'tutorial',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        rewards_id: rewards[0].id,
      },
    }),
    prisma.quest.create({
      data: {
        title: '上級クエスト: データベース設計の実践',
        description: '実際のプロジェクトで使用するデータベースの設計と実装を行います。',
        type: 'advanced',
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        rewards_id: rewards[1].id,
      },
    }),
    prisma.quest.create({
      data: {
        title: 'チームクエスト: グループ開発体験',
        description: 'チームでの開発プロセスを体験し、協力してプロジェクトを完成させます。',
        type: 'team',
        status: 'planning',
        start_date: new Date('2024-02-01'),
        end_date: new Date('2024-06-30'),
      },
    }),
  ]);

  console.log('📋 Created quests');

  // Create quest participants
  await Promise.all([
    prisma.questParticipant.create({
      data: {
        user_id: users[1].id,
        quest_id: quests[0].id,
        joined_at: new Date('2024-01-15'),
        completed_at: new Date('2024-01-20'),
        cleared_at: new Date('2024-01-20'),
        feedback_submitted: true,
      },
    }),
    prisma.questParticipant.create({
      data: {
        user_id: users[2].id,
        quest_id: quests[0].id,
        joined_at: new Date('2024-01-16'),
        completed_at: new Date('2024-01-22'),
        cleared_at: new Date('2024-01-22'),
        feedback_submitted: false,
      },
    }),
    prisma.questParticipant.create({
      data: {
        user_id: users[1].id,
        quest_id: quests[1].id,
        joined_at: new Date('2024-01-25'),
        completed_at: null,
        cleared_at: null,
        feedback_submitted: false,
      },
    }),
  ]);

  console.log('👥 Created quest participants');

  // Create entries
  await Promise.all([
    prisma.entry.create({
      data: {
        user_id: users[2].id,
        quest_id: quests[1].id,
        reason: 'データベース設計のスキルを向上させたい',
        status: 'approved',
        applied_at: new Date('2024-01-20'),
        approved_at: new Date('2024-01-21'),
      },
    }),
    prisma.entry.create({
      data: {
        user_id: users[3].id,
        quest_id: quests[2].id,
        reason: 'チーム開発の経験を積みたい',
        status: 'pending',
        applied_at: new Date('2024-01-25'),
      },
    }),
  ]);

  console.log('📝 Created entries');

  // Create offers
  await Promise.all([
    prisma.offer.create({
      data: {
        user_id: users[0].id,
        quest_id: quests[2].id,
        reason: 'チームクエストのメンターとして参加したい',
        status: 'accepted',
        sent_at: new Date('2024-01-20'),
        responded_at: new Date('2024-01-22'),
      },
    }),
  ]);

  console.log('🤝 Created offers');

  // Create clear submissions
  await Promise.all([
    prisma.clearSubmission.create({
      data: {
        user_id: users[1].id,
        quest_id: quests[0].id,
        submission_url: 'https://github.com/example/tutorial-quest',
        status: 'approved',
        submitted_at: new Date('2024-01-20'),
        reviewed_at: new Date('2024-01-21'),
      },
    }),
    prisma.clearSubmission.create({
      data: {
        user_id: users[2].id,
        quest_id: quests[0].id,
        submission_url: 'https://github.com/example/tutorial-quest-2',
        status: 'pending',
        submitted_at: new Date('2024-01-22'),
      },
    }),
  ]);

  console.log('📤 Created clear submissions');

  // Create feedbacks
  await Promise.all([
    prisma.feedback.create({
      data: {
        user_id: users[1].id,
        quest_id: quests[0].id,
        comment: 'とても分かりやすいチュートリアルでした。初心者でも安心して取り組めます。',
      },
    }),
  ]);

  console.log('💬 Created feedbacks');

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        reviewer_id: users[0].id,
        guest_id: users[1].id,
        rating: 5.0,
        comment: '素晴らしい参加者でした。積極的に取り組んでくれました。',
      },
    }),
  ]);

  console.log('⭐ Created reviews');

  // Create incentive payments
  await Promise.all([
    prisma.incentivePayment.create({
      data: {
        user_id: users[1].id,
        quest_id: quests[0].id,
        incentive_amount: 5000.00,
        status: 'paid',
        paid_at: new Date('2024-01-25'),
      },
    }),
  ]);

  console.log('💸 Created incentive payments');

  // Create point transactions
  await Promise.all([
    prisma.pointTransaction.create({
      data: {
        user_id: users[1].id,
        quest_id: quests[0].id,
        point_amount: 100,
        reason_type: 'quest_completion',
      },
    }),
    prisma.pointTransaction.create({
      data: {
        user_id: users[2].id,
        quest_id: quests[0].id,
        point_amount: 100,
        reason_type: 'quest_completion',
      },
    }),
  ]);

  console.log('🎯 Created point transactions');

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        user_id: users[1].id,
        message: 'クエスト「初回クエスト: アプリの基本操作を学ぼう」が完了しました！',
        is_read: false,
      },
    }),
    prisma.notification.create({
      data: {
        user_id: users[2].id,
        message: 'クエスト「初回クエスト: アプリの基本操作を学ぼう」が完了しました！',
        is_read: false,
      },
    }),
    prisma.notification.create({
      data: {
        user_id: users[1].id,
        message: 'インセンティブ5000円が支払われました。',
        is_read: true,
        read_at: new Date('2024-01-26'),
      },
    }),
  ]);

  console.log('🔔 Created notifications');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
