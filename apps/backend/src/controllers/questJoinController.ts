import { Request, Response } from "express";
import { addUserToQuest } from "../services/questJoinService";

export const joinQuest = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.uid); // Firebase UID など
    const questId = Number(req.params.questId);

    if (!userId || !questId) {
      return res.status(400).json({ success: false, message: "Invalid parameters" });
    }

    const result = await addUserToQuest(userId, questId);

    if (!result) {
      return res.status(400).json({ success: false, message: "参加できませんでした" });
    }

    res.json({ success: true, message: "参加しました" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "サーバーエラー" });
  }
};
