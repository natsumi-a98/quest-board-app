import { Request, Response } from "express";
import {
  getAllQuestsService,
  getAllQuestsIncludingDeletedService,
  getQuestByIdService,
  getQuestByIdIncludingDeletedService,
  updateQuestStatusService,
  createQuestService,
  updateQuestService,
  deleteQuestService,
  restoreQuestService,
} from "../services/questService";
import { getUserByFirebaseUidService } from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { badRequest, notFound } from "../utils/appError";

const QUEST_STATUS_SET = new Set([
  "active",
  "in_progress",
  "inactive",
  "completed",
  "draft",
  "pending",
]);

const getStatusParam = (status: unknown) =>
  typeof status === "string" && QUEST_STATUS_SET.has(status) ? status : undefined;

export const getAllQuests = asyncHandler(async (req: Request, res: Response) => {
  const quests = await getAllQuestsService({
    keyword: req.query.keyword as string | undefined,
    status: getStatusParam(req.query.status),
  });
  res.json(quests);
});

export const updateQuestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body as { status?: string };

    if (!status) {
      throw badRequest("status is required");
    }

    if (!QUEST_STATUS_SET.has(status)) {
      throw badRequest("invalid status");
    }

    const quest = await updateQuestStatusService(id, status);
    res.json(quest);
  }
);

export const getQuestById = asyncHandler(async (req: Request, res: Response) => {
  const quest = await getQuestByIdService(Number(req.params.id));
  if (!quest) {
    throw notFound("Quest not found");
  }

  res.json(quest);
});

export const createQuest = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    type,
    status,
    maxParticipants,
    tags = [],
    start_date,
    end_date,
    incentive_amount,
    point_amount,
    note,
  } = req.body;

  if (
    !title ||
    !description ||
    !type ||
    !maxParticipants ||
    !start_date ||
    !end_date
  ) {
    throw badRequest(
      "title, description, type, maxParticipants, start_date, end_date are required"
    );
  }

  let finalStatus = status || "draft";

  if (req.user?.uid) {
    const user = await getUserByFirebaseUidService(req.user.uid);

    if (user) {
      if (user.role === "user" && !status) {
        finalStatus = "pending";
      } else if (user.role === "admin") {
        finalStatus = status || "draft";
      }
    }
  }

  const quest = await createQuestService({
    title,
    description,
    type,
    status: finalStatus,
    maxParticipants: Number(maxParticipants),
    tags,
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    incentive_amount: incentive_amount ? Number(incentive_amount) : 0,
    point_amount: point_amount ? Number(point_amount) : 0,
    note: note || "",
  });

  res.status(201).json(quest);
});

export const updateQuest = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const {
    title,
    description,
    type,
    status,
    maxParticipants,
    tags = [],
    start_date,
    end_date,
    incentive_amount,
    point_amount,
    note,
  } = req.body;

  if (Number.isNaN(id)) {
    throw badRequest("Invalid quest ID");
  }

  if (
    !title ||
    !description ||
    !type ||
    !maxParticipants ||
    !start_date ||
    !end_date
  ) {
    throw badRequest(
      "title, description, type, maxParticipants, start_date, end_date are required"
    );
  }

  try {
    const quest = await updateQuestService(id, {
      title,
      description,
      type,
      status,
      maxParticipants: Number(maxParticipants),
      tags,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      incentive_amount: incentive_amount ? Number(incentive_amount) : 0,
      point_amount: point_amount ? Number(point_amount) : 0,
      note: note || "",
    });

    res.json(quest);
  } catch (error) {
    if (error instanceof Error && error.message === "Quest not found") {
      throw notFound(error.message);
    }

    throw error;
  }
});

export const deleteQuest = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw badRequest("Invalid quest ID");
  }

  try {
    await deleteQuestService(id);
    res.status(200).json({ message: "Quest deleted successfully (soft delete)" });
  } catch (error) {
    if (error instanceof Error && error.message === "Quest not found") {
      throw notFound(error.message);
    }

    throw error;
  }
});

export const getAllQuestsIncludingDeleted = asyncHandler(
  async (req: Request, res: Response) => {
    const quests = await getAllQuestsIncludingDeletedService({
      keyword: req.query.keyword as string | undefined,
      status: getStatusParam(req.query.status),
    });
    res.json(quests);
  }
);

export const submitQuestForApproval = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw badRequest("Invalid quest ID");
    }

    const quest = await getQuestByIdService(id);
    if (!quest) {
      throw notFound("Quest not found");
    }

    if (quest.status !== "draft" && quest.status !== "inactive") {
      throw badRequest("Only draft or inactive quests can be submitted for approval");
    }

    const updatedQuest = await updateQuestStatusService(id, "pending");
    res.json({
      message: "Quest submitted for approval successfully",
      quest: updatedQuest,
    });
  }
);

export const restoreQuest = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw badRequest("Invalid quest ID");
  }

  const quest = await getQuestByIdIncludingDeletedService(id);
  if (!quest) {
    throw notFound("Quest not found");
  }

  if (!quest.deleted_at) {
    throw badRequest("Only deleted quests can be restored");
  }

  const restoredQuest = await restoreQuestService(id);
  res.json({
    message: "Quest restored successfully",
    quest: restoredQuest,
  });
});

export const reactivateQuest = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw badRequest("Invalid quest ID");
    }

    const quest = await getQuestByIdService(id);
    if (!quest) {
      throw notFound("Quest not found");
    }

    if (quest.status !== "inactive") {
      throw badRequest("Only inactive quests can be reactivated");
    }

    const reactivatedQuest = await updateQuestStatusService(id, "active");
    res.json({
      message: "Quest reactivated successfully",
      quest: reactivatedQuest,
    });
  }
);
