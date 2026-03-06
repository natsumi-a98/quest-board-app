import { UserDataAccessor } from "../dataAccessor/dbAccessor/User";
import { logger } from "../config/logger";

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
    logger.error({ err: error, name, email }, "ユーザー検索エラー");
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
    logger.error({ err: error, firebaseUid }, "Firebase UIDでユーザー取得エラー");
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
    logger.error({ err: error, userData }, "ユーザー作成エラー");
    throw error;
  }
};

// 全ユーザー取得サービス（管理者用）
export const getAllUsersService = async () => {
  try {
    const users = await userDataAccessor.getAllForAdmin();
    return users;
  } catch (error) {
    logger.error({ err: error }, "全ユーザー取得エラー");
    throw error;
  }
};

// ユーザー削除サービス（Firebase含む物理削除）
export const deleteUserService = async (id: number) => {
  try {
    // まずユーザーを取得してFirebase UIDを確認
    const user = await userDataAccessor.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    // 関連データの存在確認と削除
    const relatedData = await userDataAccessor.findRelatedData(id);
    if (Object.values(relatedData).some((count) => count > 0)) {
      await userDataAccessor.deleteRelatedData(id);
    }

    // Firebase Admin SDKを使用してFirebaseユーザーを削除
    if (user.firebase_uid) {
      try {
        const admin = require("firebase-admin");
        await admin.auth().deleteUser(user.firebase_uid);
      } catch (firebaseError) {
        logger.error(
          { err: firebaseError, firebaseUid: user.firebase_uid },
          "Firebase ユーザーの削除に失敗しました"
        );
        // Firebase削除に失敗してもDB削除は続行（ユーザーが既に削除されている可能性）
      }
    }

    // データベースからユーザーを削除
    const deletedUser = await userDataAccessor.delete(id);
    return deletedUser;
  } catch (error) {
    logger.error({ err: error, userId: id }, "ユーザー削除エラー");
    throw error;
  }
};
