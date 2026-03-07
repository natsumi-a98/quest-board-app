import { NextFunction, Request, Response } from "express";

export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
};
