import { apiClient } from "./httpClient";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface GetUserIdResponse {
  userId: number;
}

export interface FindUserRequest {
  name?: string;
  email?: string;
}

export const userService = {
  /**
   * 名前またはメールアドレスでユーザーを検索
   */
  findUserByNameOrEmail: async (
    data: FindUserRequest
  ): Promise<UserResponse> => {
    return apiClient.post<UserResponse, FindUserRequest>("/users/find", data);
  },

  /**
   * 名前またはメールアドレスでユーザーIDを取得
   */
  getUserIdByNameOrEmail: async (
    data: FindUserRequest
  ): Promise<GetUserIdResponse> => {
    return apiClient.post<GetUserIdResponse, FindUserRequest>(
      "/users/get-id",
      data
    );
  },
};
