import express from "express";
import {
  findUserByNameOrEmail,
  getUserIdByNameOrEmail,
  createUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
} from "../controllers/userController";
import { authMiddleware, requireAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/find", authMiddleware, findUserByNameOrEmail); // POST /users/find
router.post("/get-id", authMiddleware, getUserIdByNameOrEmail); // POST /users/get-id
router.post("/create", authMiddleware, createUser); // POST /users/create
router.get("/me", authMiddleware, getCurrentUser); // GET /users/me
router.get("/all", authMiddleware, requireAdmin, getAllUsers); // GET /users/all
router.delete("/:id", authMiddleware, requireAdmin, deleteUser); // DELETE /users/:id (管理者用)

export default router;
