import { Request, Response } from "express";
import { ROLES } from "../constants/roles";
import {
  findUserByNameOrEmailService,
  createUserService,
  getUserByFirebaseUidService,
  getAllUsersService,
  deleteUserService,
} from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from "../utils/appError";

export const findUserByNameOrEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name && !email) {
      throw badRequest("name or email is required");
    }

    const user = await findUserByNameOrEmailService(name, email);
    if (!user) {
      throw notFound("User not found");
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
);

export const getUserIdByNameOrEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name && !email) {
      throw badRequest("name or email is required");
    }

    const user = await findUserByNameOrEmailService(name, email);
    if (!user) {
      throw notFound("User not found");
    }

    res.json({ userId: user.id });
  }
);

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const firebaseUser = req.user;
  if (!firebaseUser) {
    throw unauthorized();
  }

  const { name, role = ROLES.USER } = req.body;
  if (!name) {
    throw badRequest("name is required");
  }

  const existingUser = await findUserByNameOrEmailService(
    name,
    firebaseUser.email || ""
  );
  if (existingUser) {
    throw conflict("User already exists");
  }

  const newUser = await createUserService({
    name,
    email: firebaseUser.email || "",
    role,
    firebaseUid: firebaseUser.uid,
  });

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const firebaseUser = req.user;
    if (!firebaseUser) {
      throw unauthorized();
    }

    const user = await getUserByFirebaseUidService(firebaseUser.uid);
    if (!user) {
      throw notFound("User not found");
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
);

export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await getAllUsersService();
  res.json(users);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw badRequest("Invalid user ID");
  }

  try {
    const deletedUser = await deleteUserService(id);

    res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: deletedUser.id,
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      throw notFound(error.message);
    }

    throw error;
  }
});
