import { privateDecrypt } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
          activeStatus: true,
        },
      },
      comments: true,
    },
  });
  return result;
};
const getSinglePost = async (postId: string) => {
  ///when see single post view ++ logic
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    omit: {
      authorId: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      tags: true,
      isFeatured: true,
      thumbnail: true,
    },
    include: {
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return post;
};
const updatePost = async (
  postId: string,
  isAdmin: boolean,
  authorId: string,
  payload: IUpdatePostPayload,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...payload,
    },
    include: {
      author: {
        omit: {
          id: true,
          activeStatus: true,

          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};
const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};
export const postService = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
};
