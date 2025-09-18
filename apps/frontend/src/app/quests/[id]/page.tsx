"use client";

import QuestDetailPage from "@/components/pages/QuestDetailPage";
import React from "react";

interface QuestPageProps {
  params: Promise<{ id: string }>;
}

const Page: React.FC<QuestPageProps> = ({ params }) => {
  const { id } = React.use(params);

  // id を使って API からクエストデータを取得
  return <QuestDetailPage questId={id} />;
};

export default Page;
