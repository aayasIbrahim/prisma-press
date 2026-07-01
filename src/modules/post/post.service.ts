import { privateDecrypt } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";
import {
  CommentStatus,
  PostStatus,
  Role,
} from "../../../prisma/generated/prisma/enums";

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
  // ///when see single post view ++ logic
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });
  // // throw new Error("Fake Error");
  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   omit: {
  //     authorId: true,
  //     createdAt: true,
  //     updatedAt: true,
  //     status: true,
  //     tags: true,
  //     isFeatured: true,
  //     thumbnail: true,
  //   },
  //   include: {
  //     comments: {
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });
  //return post;

  const transictionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
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
  });
  return transictionResult;
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
const getPostStats = async () => {
  const result = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublicPost,
      totalDraftPosts,
      totalArchivedposts,
      totalComments,
      totalApprovedComment,
      totalUser,
      totalAdminUser,
      totalregularUser,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: Role.ADMIN,
        },
      }),
      await tx.user.count({
        where: {
          role: Role.USER,
        },
      }),
      await tx.post.aggregate({
        _count: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublicPost,
      totalDraftPosts,
      totalArchivedposts,
      totalComments,
      totalApprovedComment,
      totalUser,
      totalAdminUser,
      totalregularUser,
      totalPostViewsAggregate,
    };
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
  getPostStats,
  deletePost,
};
