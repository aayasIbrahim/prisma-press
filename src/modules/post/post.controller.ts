import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
const createPost = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const paylaod = req.body;
  console.log(id, "id form create post in controller");
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
export const postController = {
  createPost,
  getAllPosts,
  getSinglePosts,
};
