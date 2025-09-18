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
