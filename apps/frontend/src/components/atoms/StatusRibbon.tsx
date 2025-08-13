import React from "react";
import { statusConfig } from "../../constants/config";

type StatusRibbonProps = {
  status: "participating" | "completed" | "applied"; // 参加中、達成済み、応募中
  className?: string;
};

// クエストクエストの状態を表すリボンラベル
const StatusRibbon: React.FC<StatusRibbonProps> = ({
  status,
  className = "",
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`absolute -top-2 -right-2 ${config.bg} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ${className}`}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  );
};

export default StatusRibbon;
