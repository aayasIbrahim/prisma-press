import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async (req: Request, res: Response) => {});
export const commentController = {
  createComment,
};
