"use client";

import React, { useState } from "react";
import StatusRibbon from "../atoms/StatusRibbon";
import Tag from "../atoms/Tag";
import ReviewSection, { Review, NewReview } from "../organisms/ReviewSection";

interface Quest {
  id: number;
  title: string;
  description: string;
  reward: number;
  deadline?: string;
  progress?: number;
  difficulty: "初級" | "中級" | "上級";
  category: string;
  completedDate?: string;
  appliedDate?: string;
}

interface QuestDetailPageProps {
  questId?: string;
}

// サンプルクエスト
const sampleQuest: Quest = {
  id: 1,
  title: "React開発スキル向上チャレンジ",
  description:
    "Reactを使用したモダンなWebアプリ開発に挑戦。TypeScriptやHooksを学びます。",
  reward: 500,
  difficulty: "中級",
  category: "開発",
  deadline: "2024-12-31",
  progress: 100,
  completedDate: "2024-12-31",
  appliedDate: "2024-03-01",
};

// サンプルレビュー5件
const sampleReviews: Review[] = [
  {
    id: 1,
    user: "Alice",
    score: 5,
    comment: "面白かった！",
    date: "2024-03-10",
  },
  {
    id: 2,
    user: "Bob",
    score: 4,
    comment: "学びが多かったです。",
    date: "2024-03-11",
  },
  {
    id: 3,
    user: "Charlie",
    score: 3,
    comment: "少し難しかったですが楽しかった。",
    date: "2024-03-12",
  },
  {
    id: 4,
    user: "Diana",
    score: 4,
    comment: "チーム開発の練習になりました。",
    date: "2024-03-13",
  },
  {
    id: 5,
    user: "Eve",
    score: 5,
    comment: "TypeScriptの理解が深まりました。",
    date: "2024-03-14",
  },
];

const QuestDetailPage: React.FC<QuestDetailPageProps> = ({ questId }) => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [newReview, setNewReview] = useState<NewReview>({
    score: 0,
    comment: "",
  });

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "初級":
        return "bg-green-500";
      case "中級":
        return "bg-yellow-500";
      case "上級":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSubmitReview = () => {
    if (!newReview.comment || newReview.score === 0) return;

    const review: Review = {
      id: reviews.length + 1,
      user: "You",
      score: newReview.score,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("ja-JP"),
    };

    setReviews([review, ...reviews]);
    setNewReview({ score: 0, comment: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* クエスト情報 */}
      <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-6 border-2 border-amber-200 space-y-4">
        <StatusRibbon status="completed" />
        <div
          className={`absolute top-4 left-4 w-3 h-3 rounded-full ${getDifficultyColor(
            sampleQuest.difficulty
          )}`}
        ></div>

        <h1 className="text-2xl font-bold text-slate-800">
          {sampleQuest.title}
        </h1>
        <p className="text-slate-600">{sampleQuest.description}</p>
        <div className="flex flex-wrap gap-2">
          <Tag color="blue">{sampleQuest.category}</Tag>
        </div>
      </div>

      {/* レビュー */}
      <ReviewSection
        reviews={reviews}
        newReview={newReview}
        setNewReview={setNewReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default QuestDetailPage;
