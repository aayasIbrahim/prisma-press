import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface";

const createComment = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });
  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });
  return comment;
};
const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findFirstOrThrow({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};
export const commentService = {
  createComment,
  getCommentByAuthorId,
};
