import { UserDataAccessor } from "../dataAccessor/dbAccessor/User";

const userDataAccessor = new UserDataAccessor();

export const getAllUsersForAdminService = async () => {
  return await userDataAccessor.getAllForAdmin();
};
