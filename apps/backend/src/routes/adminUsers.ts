import express from "express";
import { getAllUsersForAdmin } from "../controllers/adminUserController";

const router = express.Router();

// GET /api/admin/users
router.get("/", getAllUsersForAdmin);

export default router;
