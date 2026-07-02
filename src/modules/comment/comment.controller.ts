import { Result } from "./../../../prisma/generated/prisma/internal/prismaNamespace";
import httpStatus from "http-status";

import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import { prisma } from "../../lib/prisma";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const payload = req.body;
  const result = await commentService.createComment(
    authorId as string,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});
const getCommentByAuthorId = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  const result = await commentService.getCommentByAuthorId(authorId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const result = await commentService.getCommentByCommentId(postId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment retrieved successfully",
      data: result,
    });
  },
);
const updateComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const payload = req.body;
  const commentId = req.params.commentId;
  const result = await commentService.updateComment(
    authorId as string,
    payload,
    commentId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const commentId = req.params.commentId;
  await commentService.deleteComment(authorId as string, commentId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment delete successfully",
    data: null,
  });
});
const moderateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  const data = req.body;
  const result = await commentService.moderateComment(
    commentId as string,
    data,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment delete successfully",
    data: null,
  });
});
export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
