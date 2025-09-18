import express from "express";
import {
  findUserByNameOrEmail,
  getUserIdByNameOrEmail,
} from "../controllers/userController";

const router = express.Router();

router.post("/find", findUserByNameOrEmail); // POST /users/find
router.post("/get-id", getUserIdByNameOrEmail); // POST /users/get-id

export default router;
