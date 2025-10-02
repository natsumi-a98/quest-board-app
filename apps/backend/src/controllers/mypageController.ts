// controllers/mypageController.ts
import { Request, Response } from "express";
import {
  getUserEntries,
  getUserProfile,
  getUserNotifications,
} from "../services/mypageService";

// 自分の参加中クエスト一覧
export const getMyEntries = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

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
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

    const user = await getUserProfile(userId);
    res.json(user ?? {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 自分の通知一覧取得
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

    const notifs = await getUserNotifications(userId);

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
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

    // getUserEntriesから達成済みクエストを取得
    const entries = await getUserEntries(userId);
    res.json(entries.completed || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cleared quests" });
  }
};
