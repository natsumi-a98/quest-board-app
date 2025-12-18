import { Request, Response } from "express";
import { addUserToQuest } from "../services/questJoinService";
import { getUserByFirebaseUidService } from "../services/userService";

export const joinQuest = async (req: Request, res: Response) => {
  try {
    const firebaseUid = (req.user as any)?.uid;
    if (!firebaseUid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await getUserByFirebaseUidService(firebaseUid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userId = user.id;
    const questId = Number(req.params.questId);

    if (!questId) {
      return res.status(400).json({ success: false, message: "Invalid quest ID" });
    }

    const result = await addUserToQuest(userId, questId);

    if (!result || !result.success) {
      const errorMessage = result?.reason === "duplicate"
        ? "既に参加しています"
        : result?.reason === "full"
        ? "参加人数が上限に達しています"
        : result?.reason === "not_found"
        ? "クエストが見つかりません"
        : "参加に失敗しました";
      return res.status(400).json({ success: false, message: errorMessage });
    }

    res.json({ success: true, message: "クエストに参加しました！" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "サーバーエラー" });
  }
};
