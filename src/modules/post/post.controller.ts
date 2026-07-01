import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const paylaod = req.body;

  const result = await postService.createPost(paylaod, id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post Created SuccessFully",
    data: result,
  });
});
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getAllPosts();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts Retrieved Successfully",
    data: result,
  });
});
const getSinglePosts = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  if (!postId) {
    throw new Error("Post Id Required In Params");
  }
  const result = await postService.getSinglePost(postId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfuly",
    data: result,
  });
});
const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const isAdmin = req.user?.role === "ADMIN";
  const authorId = req.user?.id;
  const payload = req.body;
  if (!postId) {
    throw new Error("Post Id Required In Params");
  }
  const result = await postService.updatePost(
    postId as string,
    isAdmin,
    authorId as string,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: result,
  });
});
const getPostStats = catchAsync(async (req: Request, res: Response) => {
  
  const result = await postService.getPostStats();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post stats retrieved successfully",
    data: result,
  });
});
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const isAdmin = req.user?.role === "ADMIN";
  const postId = req.params.postId;
  await postService.deletePost(postId as string, authorId as string, isAdmin);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null,
  });
});
export const postController = {
  createPost,
  getAllPosts,
  getSinglePosts,
  updatePost,
  getPostStats,
  deletePost,
};
