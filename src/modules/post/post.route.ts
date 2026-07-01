import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();
router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.createPost,
);
router.get("/", postController.getAllPosts);
router.get("/stats", auth(Role.ADMIN), postController.getPostStats);
router.get("/:postId", postController.getSinglePosts);
router.patch(
  "/:postId",
  auth(Role.USER, Role.ADMIN),
  postController.updatePost,
);

router.delete(
  "/:postId",
  auth(Role.ADMIN, Role.USER),
  postController.deletePost,
);
export const postRoutes = router;
