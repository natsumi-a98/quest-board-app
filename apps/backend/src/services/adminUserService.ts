import { UserDataAccessor } from "../dataAccessor/dbAccessor/User";

const userDataAccessor = new UserDataAccessor();

export const getAllUsersForAdminService = async () => {
  return await userDataAccessor.getAllForAdmin();
};

export const updateUserRoleService = async (
  userId: number,
  newRole: string
) => {
  try {
    // 有効なロールかチェック
    const validRoles = ["admin", "user"];
    if (!validRoles.includes(newRole)) {
      throw new Error("Invalid role. Must be 'admin' or 'user'");
    }

    // ユーザーが存在するかチェック
    const existingUser = await userDataAccessor.findById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // ロールを更新
    const updatedUser = await userDataAccessor.update(userId, {
      role: newRole,
    });
    return updatedUser;
  } catch (error) {
    console.error("ユーザーロール更新エラー:", error);
    throw error;
  }
};
