// controllers/mypageController.ts
import { Request, Response } from "express";
import {
  getUserEntries,
  getUserProfile,
  getUserNotifications,
} from "../services/mypageService";
import { getUserByFirebaseUidService } from "../services/userService";

// 自分の参加中クエスト一覧
export const getMyEntries = async (req: Request, res: Response) => {
  try {
    const firebaseUid = (req.user as any)?.uid;
    if (!firebaseUid) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUserByFirebaseUidService(firebaseUid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userId = user.id;

    const entries = await getUserEntries(userId);
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// 自分のプロフィール取得
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const firebaseUid = (req.user as any)?.uid;
    if (!firebaseUid) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUserByFirebaseUidService(firebaseUid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await getUserProfile(user.id);
    res.json(profile ?? {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 自分の通知一覧取得
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const firebaseUid = (req.user as any)?.uid;
    if (!firebaseUid) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUserByFirebaseUidService(firebaseUid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notifs = await getUserNotifications(user.id);

    // 配列で返すように安全策を追加
    res.json(Array.isArray(notifs) ? notifs : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// 自分の達成済みクエスト一覧
export const getMyClearedQuests = async (req: Request, res: Response) => {
  try {
    const firebaseUid = (req.user as any)?.uid;
    if (!firebaseUid) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUserByFirebaseUidService(firebaseUid);
    if (!user) return res.status(404).json({ message: "User not found" });

    // getUserEntriesから達成済みクエストを取得
    const entries = await getUserEntries(user.id);
    res.json(entries.completed || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cleared quests" });
  }
};
