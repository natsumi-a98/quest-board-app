import { UserDataAccessor } from "../dataAccessor/dbAccessor/User";

const userDataAccessor = new UserDataAccessor();

// ユーザー検索サービス
export const findUserByNameOrEmailService = async (
  name: string,
  email: string
) => {
  try {
    const user = await userDataAccessor.findByNameOrEmail(name, email);
    return user;
  } catch (error) {
    console.error("ユーザー検索エラー:", error);
    throw error;
  }
};

// ユーザーID取得サービス
export const getUserIdByNameOrEmailService = async (
  name: string,
  email: string
): Promise<number | null> => {
  const user = await findUserByNameOrEmailService(name, email);
  return user ? user.id : null;
};

// Firebase UIDでユーザー取得サービス
export const getUserByFirebaseUidService = async (firebaseUid: string) => {
  try {
    const user = await userDataAccessor.findByFirebaseUid(firebaseUid);
    return user;
  } catch (error) {
    console.error("Firebase UIDでユーザー取得エラー:", error);
    throw error;
  }
};

// ユーザー作成サービス
export const createUserService = async (userData: {
  name: string;
  email: string;
  role: string;
  firebaseUid: string;
}) => {
  try {
    const user = await userDataAccessor.create({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      firebase_uid: userData.firebaseUid, // Firebase UIDを保存
    });
    return user;
  } catch (error) {
    console.error("ユーザー作成エラー:", error);
    throw error;
  }
};

// 全ユーザー取得サービス（管理者用）
export const getAllUsersService = async () => {
  try {
    const users = await userDataAccessor.findAll();
    return users;
  } catch (error) {
    console.error("全ユーザー取得エラー:", error);
    throw error;
  }
};
