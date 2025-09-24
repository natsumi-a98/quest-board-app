import { apiClient, authenticatedApiClient } from "./httpClient";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role?: string;
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

  /**
   * 現在のユーザー情報を取得（認証済み）
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    return authenticatedApiClient.get<UserResponse>("/users/me");
  },

  /**
   * 全ユーザーを取得（管理者用）
   */
  getAllUsers: async (): Promise<UserResponse[]> => {
    return apiClient.get<UserResponse[]>("/users/all");
  },
};
