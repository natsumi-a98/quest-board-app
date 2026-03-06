import { Request, Response } from "express";
import { mypageService } from "../services/mypageService";
import { getUserByFirebaseUidService } from "../services/userService";
import { asyncHandler } from "../utils/asyncHandler";
import { notFound, unauthorized } from "../utils/appError";

const getCurrentAppUserId = async (req: Request) => {
  const firebaseUid = req.user?.uid;
  if (!firebaseUid) {
    throw unauthorized();
  }

  const user = await getUserByFirebaseUidService(firebaseUid);
  if (!user) {
    throw notFound("User not found");
  }

  return user.id;
};

export const getMyEntries = asyncHandler(async (req: Request, res: Response) => {
  const userId = await getCurrentAppUserId(req);
  const entries = await mypageService.getUserEntries(userId);
  res.json(entries);
});

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = await getCurrentAppUserId(req);
  const profile = await mypageService.getUserProfile(userId);
  res.json(profile ?? {});
});

export const getMyNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = await getCurrentAppUserId(req);
    const notifications = await mypageService.getUserNotifications(userId);
    res.json(Array.isArray(notifications) ? notifications : []);
  }
);

export const getMyClearedQuests = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = await getCurrentAppUserId(req);
    const entries = await mypageService.getUserEntries(userId);
    res.json(entries.completed || []);
  }
);
