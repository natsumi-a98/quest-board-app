// controllers/mypageController.ts
import { Request, Response } from "express";
import {
  getUserEntries,
  getUserClearedQuests,
  getUserAppliedQuests,
  getUserProfile,
  getUserNotifications,
} from "../services/mypageService";

export const getMyEntries = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

    const participating = await getUserEntries(userId);
    const completed = await getUserClearedQuests(userId);
    const applied = await getUserAppliedQuests(userId);

    res.json({ participating, completed, applied });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

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

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

    const notifs = await getUserNotifications(userId);
    res.json(notifs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const getMyClearedQuests = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });

    const cleared = await getUserClearedQuests(userId);

    res.json(cleared ?? []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cleared quests" });
  }
};
