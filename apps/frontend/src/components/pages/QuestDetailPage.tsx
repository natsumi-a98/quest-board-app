"use client";

import React, { useState, useEffect } from "react";
import StatusRibbon from "../atoms/StatusRibbon";
import Tag from "../atoms/Tag";
import ReviewSection, { Review, NewReview } from "../organisms/ReviewSection";
import { questService } from "../../services/quest";
import { reviewService, ReviewResponse } from "../../services/review";
import { Quest, QuestStatus } from "../../types/quest";

interface QuestDetailPageProps {
  questId?: string;
}

const QuestDetailPage: React.FC<QuestDetailPageProps> = ({ questId }) => {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<NewReview>({
    score: 0,
    comment: "",
  });

  // クエストデータとレビューデータを取得
  useEffect(() => {
    const fetchData = async () => {
      if (!questId) {
        setError("クエストIDが指定されていません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // クエストデータとレビューデータを並行取得
        const [questData, reviewsData] = await Promise.all([
          questService.getQuestById(questId),
          reviewService.getReviewsByQuestId(questId).catch(() => []), // レビュー取得失敗時は空配列
        ]);

        setQuest(questData);

        // APIから取得したレビューデータを変換
        const convertedReviews: Review[] = reviewsData.map(
          (review: ReviewResponse) => ({
            id: review.id,
            user: review.reviewer.name,
            score: review.rating,
            comment: review.comment || "",
            date: new Date(review.created_at).toLocaleDateString("ja-JP"),
          })
        );

        setReviews(convertedReviews);
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questId]);

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

  const handleSubmitReview = async () => {
    if (!newReview.comment || newReview.score === 0 || !questId) return;

    try {
      // APIにレビューを投稿
      const response = await reviewService.createReview(questId, {
        reviewer_id: 1, // 仮のユーザーID（実際の実装では認証から取得）
        rating: newReview.score,
        comment: newReview.comment,
      });

      // 成功時はローカル状態を更新
      const newReviewData: Review = {
        id: response.id,
        user: response.reviewer.name,
        score: response.rating,
        comment: response.comment || "",
        date: new Date(response.created_at).toLocaleDateString("ja-JP"),
      };

      setReviews([newReviewData, ...reviews]);
      setNewReview({ score: 0, comment: "" });
    } catch (err) {
      console.error("レビュー投稿エラー:", err);
      // エラー時はアラートを表示（実際の実装ではより良いエラーハンドリングを実装）
      alert("レビューの投稿に失敗しました。もう一度お試しください。");
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">クエスト情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error || !quest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">×</span>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">
            {error || "クエストが見つかりません"}
          </h2>
          <p className="text-red-600">
            クエストの情報を取得できませんでした。URLを確認してください。
          </p>
        </div>
      </div>
    );
  }

  // 完了していないクエストの場合はエラー表示
  if (quest.status !== QuestStatus.Completed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">×</span>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">
            レビューできません
          </h2>
          <p className="text-red-600">
            このクエストはまだ完了していません。完了後にレビューを投稿できます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* クエスト情報 */}
      <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg p-6 border-2 border-amber-200 space-y-4">
        <StatusRibbon status="completed" />
        {quest.difficulty && (
          <div
            className={`absolute top-4 left-4 w-3 h-3 rounded-full ${getDifficultyColor(
              quest.difficulty
            )}`}
          ></div>
        )}

        <h1 className="text-2xl font-bold text-slate-800">{quest.title}</h1>
        <p className="text-slate-600">{quest.description}</p>
        <div className="flex flex-wrap gap-2">
          <Tag color="blue">{quest.type}</Tag>
          {quest.tags &&
            quest.tags.map((tag, index) => (
              <Tag key={index} color="purple">
                {tag}
              </Tag>
            ))}
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
