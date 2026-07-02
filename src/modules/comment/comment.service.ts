import { prisma } from "../../lib/prisma";
import {
  ICreateCommentPayload,
  IModerateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

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
const getCommentByCommentId = async (postId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      postId,
    },
  });
  return comment;
};
const updateComment = async (
  authorId: string,
  payload: IUpdateCommentPayload,
  commentId: string,
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  const updateData = await prisma.comment.update({
    where: {
      id: comment.id,
      authorId,
    },
    data: {
      ...payload,
    },
    select: {
      id: true,
      content: true,
      authorId: true,
    },
  });

  return updateData;
};

const deleteComment = async (authorId: string, commentId: string) => {
  const comment = await prisma.comment.findFirstOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });
  const deleteComment = await prisma.comment.delete({
    where: {
      id: comment.id,
    },
  });

  return deleteComment;
};
const moderateComment = async (
  commentId: string,
  data: IModerateCommentPayload,
) => {
  const commentdata = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentdata.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already up to date.`,
    );
  }

  const moderateComment = await prisma.comment.update({
    where: {
      id: commentdata.id,
    },
    data,
  });

  return moderateComment;
};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
