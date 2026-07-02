import { auth } from "./../../middleware/auth";
import { Router } from "express";
import { commentController } from "./comment.controller";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();
router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.createComment,
);
router.get("/author/:authorId", commentController.getCommentByAuthorId);

export const commentRouter = router;
