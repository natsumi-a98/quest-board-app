"use client";

import QuestDetailPage from "@/components/pages/QuestDetailPage";
import React from "react";

interface QuestPageProps {
  params: { id: string };
}

const Page: React.FC<QuestPageProps> = ({ params }) => {
  const { id } = params;

  // 将来的には id を使って API からクエストデータを取得
  return <QuestDetailPage questId={id} />;
};

export default Page;
