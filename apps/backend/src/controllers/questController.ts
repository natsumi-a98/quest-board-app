import { Request, Response } from "express";
import {
  getAllQuestsService,
  getQuestByIdService,
} from "../services/questService";

export const getAllQuests = (req: Request, res: Response) => {
  const { keyword, status } = req.query;

  const quests = getAllQuestsService({
    keyword: keyword as string,
    status: status as string,
  });

  res.json(quests);
};

export const getQuestById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quest = getQuestByIdService(id);
  if (quest) {
    res.json(quest);
  } else {
    res.status(404).json({ message: "Quest not found" });
  }
};
