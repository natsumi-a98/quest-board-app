import { Request, Response } from "express";
import {
  getAllQuestsService,
  getQuestByIdService,
  updateQuestStatusService,
} from "../services/questService";

// 全クエスト取得
export const getAllQuests = async (req: Request, res: Response) => {
  const { keyword, status } = req.query;

  const allowed = new Set(["active", "in_progress", "inactive", "completed"]);
  const statusParam =
    typeof status === "string" && allowed.has(status) ? status : undefined;

  try {
    const quests = await getAllQuestsService({
      keyword: keyword as string | undefined,
      status: statusParam,
    });
    res.json(quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch quests" });
  }
};

// ステータス更新
export const updateQuestStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status?: string };

  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  const allowed = new Set(["active", "in_progress", "inactive", "completed"]);
  if (!allowed.has(status)) {
    return res.status(400).json({ message: "invalid status" });
  }

  try {
    const quest = await updateQuestStatusService(id, status);
    res.json(quest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update quest status" });
  }
};

// IDでクエスト取得
export const getQuestById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const quest = await getQuestByIdService(id);
    if (quest) {
      res.json(quest);
    } else {
      res.status(404).json({ message: "Quest not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch quest" });
  }
};
