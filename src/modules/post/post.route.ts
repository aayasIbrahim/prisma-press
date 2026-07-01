import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const route = Router();
route.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.createPost,
);
route.get("/", postController.getAllPosts);
route.get("/:postId", postController.getSinglePosts);
export const postRoutes = route;
