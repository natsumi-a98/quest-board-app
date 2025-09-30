import express from "express";
import {
  findUserByNameOrEmail,
  getUserIdByNameOrEmail,
  createUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/find", findUserByNameOrEmail); // POST /users/find
router.post("/get-id", getUserIdByNameOrEmail); // POST /users/get-id
router.post("/create", authMiddleware, createUser); // POST /users/create
router.get("/me", authMiddleware, getCurrentUser); // GET /users/me
router.get("/all", getAllUsers); // GET /users/all
router.delete("/:id", deleteUser); // DELETE /users/:id (管理者用)

export default router;
