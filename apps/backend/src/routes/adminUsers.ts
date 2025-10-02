import express from "express";
import {
  getAllUsersForAdmin,
  updateUserRole,
} from "../controllers/adminUserController";

const router = express.Router();

// GET /api/admin/users
router.get("/", getAllUsersForAdmin);

// PUT /api/admin/users/:userId/role
router.put("/:userId/role", updateUserRole);

export default router;
