import { Request, Response } from "express";
import {
  getAllQuestsService,
  getQuestByIdService,
} from "../services/questService";

// 全クエスト取得
export const getAllQuests = async (req: Request, res: Response) => {
  const { keyword, status } = req.query;

  try {
    const quests = await getAllQuestsService({
      keyword: keyword as string | undefined,
      status: status as string | undefined,
    });
    res.json(quests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch quests" });
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
