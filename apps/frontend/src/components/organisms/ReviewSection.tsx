"use client";

import React from "react";
import { Star, Send } from "lucide-react";
import ReviewForm from "../molecules/ReviewForm";

export interface Review {
  id: number;
  user: string;
  score: number;
  comment: string;
  date: string;
}

export interface NewReview {
  score: number;
  comment: string;
}

interface ReviewSectionProps {
  reviews: Review[];
  newReview: NewReview;
  setNewReview: (review: NewReview) => void;
  onSubmit: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  newReview,
  setNewReview,
  onSubmit,
}) => {
  const averageScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
      : 0;

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border-2 border-green-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">レビュー</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(averageScore)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-slate-700">
            {averageScore.toFixed(1)} ({reviews.length}件)
          </span>
        </div>
      </div>

      {/* 投稿フォーム */}
      <ReviewForm
        newReview={newReview}
        setNewReview={setNewReview}
        onSubmit={onSubmit}
      />

      {/* レビュー一覧 */}
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.score
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-600 text-sm">{review.user}</span>
            </div>
            <p className="text-slate-700">{review.comment}</p>
            <span className="text-xs text-slate-400">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
