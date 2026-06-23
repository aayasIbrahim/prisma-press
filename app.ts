import express, { Application, Request, Response } from "express";
import config from "./src/config";
import cors from "cors";
import cookieParse from "cookie-parser";

import { userRouter } from "./src/modules/user/user.route";
import { authRouter } from "./src/modules/auth/auth.router";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
app.get("/", (req: Request, res: Response) => {
  res.send("hello Word");
});
app.use("/api/users", userRouter);
app.use("/api/users", authRouter);

export default app;
