import { jwtUtils } from "./../../utils/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Registation Successfully",
      data: {
        user,
      },
    });
  },
);
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    const token = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
    const { id } = token.data as JwtPayload;

    const profile = await userService.getMyProfileIntoDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Retrieved Successfully",
      data: profile,
    });
  },
);
const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await userService.updateMyProfileIntoDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile Updated Successfully",
      data:  result ,
    });
  },
);
export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
