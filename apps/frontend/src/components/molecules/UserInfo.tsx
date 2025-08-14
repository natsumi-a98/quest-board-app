import React from "react";
import Avatar from "../atoms/Avatar";
import UserName from "../atoms/UserName";
import UserPoints from "../atoms/UserPoints";

type User = {
  name: string;
  avatar: React.ReactNode;
  points: number;
};

type UserInfoProps = {
  user: User;
};

// アバター、ユーザー名、ポイントをまとめて表示するコンポーネント
const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar>{user.avatar}</Avatar>
      <div>
        <UserName name={user.name} />
        <UserPoints points={user.points} />
      </div>
    </div>
  );
};

export default UserInfo;
