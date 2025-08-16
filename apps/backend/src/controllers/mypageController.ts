import { Request, Response } from "express";
import { getUserEntries, getUserClearedQuests } from "../services/mypageService";

export const getMyEntries = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id); // authMiddleware で user 情報をセット
    const entries = await getUserEntries(userId);
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

export const getMyClearedQuests = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const cleared = await getUserClearedQuests(userId);
    res.json(cleared);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cleared quests" });
  }
};
