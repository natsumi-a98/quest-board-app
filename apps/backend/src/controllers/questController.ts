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

// 全クエスト取得
export const getAllQuests = async (req: Request, res: Response) => {
  const { keyword, status } = req.query;

  const allowed = new Set([
    "active",
    "in_progress",
    "inactive",
    "completed",
    "draft",
    "pending",
  ]);
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

  const allowed = new Set([
    "active",
    "in_progress",
    "inactive",
    "completed",
    "draft",
    "pending",
  ]);
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

// クエスト作成
export const createQuest = async (req: Request, res: Response) => {
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

  // 必須フィールドのバリデーション
  if (
    !title ||
    !description ||
    !type ||
    !maxParticipants ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({
      message:
        "title, description, type, maxParticipants, start_date, end_date are required",
    });
  }

  try {
    // ユーザーのロールに基づいてデフォルトステータスを決定
    let finalStatus = status || "draft";

    if (req.user?.uid) {
      // Firebase UIDでユーザー情報を取得
      const user = await getUserByFirebaseUidService(req.user.uid);

      if (user) {
        // 一般ユーザーの場合は自動的に承認待ち
        if (user.role === "user" && !status) {
          finalStatus = "pending";
        }
        // 管理者の場合は指定されたステータスまたは下書き
        else if (user.role === "admin") {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create quest" });
  }
};

// クエスト編集
export const updateQuest = async (req: Request, res: Response) => {
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

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid quest ID" });
  }

  // 必須フィールドのバリデーション
  if (
    !title ||
    !description ||
    !type ||
    !maxParticipants ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({
      message:
        "title, description, type, maxParticipants, start_date, end_date are required",
    });
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
    console.error(error);
    if (error instanceof Error && error.message === "Quest not found") {
      res.status(404).json({ message: "Quest not found" });
    } else {
      res.status(500).json({ message: "Failed to update quest" });
    }
  }
};

// クエスト論理削除
export const deleteQuest = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid quest ID" });
  }

  try {
    await deleteQuestService(id);
    res
      .status(200)
      .json({ message: "Quest deleted successfully (soft delete)" });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "Quest not found") {
      res.status(404).json({ message: "Quest not found" });
    } else {
      res.status(500).json({ message: "Failed to delete quest" });
    }
  }
};

// 全クエスト取得（削除済みも含む）- 管理者用
export const getAllQuestsIncludingDeleted = async (
  req: Request,
  res: Response
) => {
  const { keyword, status } = req.query;

  const allowed = new Set([
    "active",
    "in_progress",
    "inactive",
    "completed",
    "draft",
    "pending",
  ]);
  const statusParam =
    typeof status === "string" && allowed.has(status) ? status : undefined;

  try {
    const quests = await getAllQuestsIncludingDeletedService({
      keyword: keyword as string | undefined,
      status: statusParam,
    });
    res.json(quests);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch quests including deleted" });
  }
};

// クエストを承認待ちにする
export const submitQuestForApproval = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid quest ID" });
  }

  try {
    // クエストの現在のステータスを確認
    const quest = await getQuestByIdService(id);
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    // 下書きまたは停止中のクエストのみ承認待ちにできる
    if (quest.status !== "draft" && quest.status !== "inactive") {
      return res.status(400).json({
        message: "Only draft or inactive quests can be submitted for approval",
        currentStatus: quest.status,
      });
    }

    // ステータスを承認待ちに変更
    const updatedQuest = await updateQuestStatusService(id, "pending");
    res.json({
      message: "Quest submitted for approval successfully",
      quest: updatedQuest,
    });
  } catch (error) {
    console.error("Quest submission error:", error);
    res.status(500).json({ message: "Failed to submit quest for approval" });
  }
};

// クエスト復元（論理削除の取り消し）
export const restoreQuest = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid quest ID" });
  }

  try {
    // クエストの現在の状態を確認（削除済みも含めて取得）
    const quest = await getQuestByIdIncludingDeletedService(id);
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    // 削除済みクエストのみ復元可能
    if (!quest.deleted_at) {
      return res.status(400).json({
        message: "Only deleted quests can be restored",
      });
    }

    // クエストを復元
    const restoredQuest = await restoreQuestService(id);
    res.json({
      message: "Quest restored successfully",
      quest: restoredQuest,
    });
  } catch (error) {
    console.error("Quest restoration error:", error);
    res.status(500).json({ message: "Failed to restore quest" });
  }
};

// クエスト再公開（停止中からアクティブに変更）
export const reactivateQuest = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid quest ID" });
  }

  try {
    // まずクエストの現在のステータスを確認
    const quest = await getQuestByIdService(id);
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    // 停止中でない場合はエラー
    if (quest.status !== "inactive") {
      return res.status(400).json({
        message: "Only inactive quests can be reactivated",
        currentStatus: quest.status,
      });
    }

    // ステータスをアクティブに変更
    const reactivatedQuest = await updateQuestStatusService(id, "active");
    res.json({
      message: "Quest reactivated successfully",
      quest: reactivatedQuest,
    });
  } catch (error) {
    console.error("Quest reactivation error:", error);
    res.status(500).json({ message: "Failed to reactivate quest" });
  }
};
