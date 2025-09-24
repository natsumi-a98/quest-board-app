import express from "express";
import {
  findUserByNameOrEmail,
  getUserIdByNameOrEmail,
  createUser,
  getCurrentUser,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/find", findUserByNameOrEmail); // POST /users/find
router.post("/get-id", getUserIdByNameOrEmail); // POST /users/get-id
router.post("/create", authMiddleware, createUser); // POST /users/create
router.get("/me", authMiddleware, getCurrentUser); // GET /users/me

export default router;
