import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { IRegisterUser } from "./user.interface";
import config from "../../config";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const { name, email, password, profilePhoto } = payload;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const hasdPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hasdPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: newUser.id,
      email: newUser.email || email,
    },
    omit: {
      password: true,
    },

    include: {
      // Include related profile data (similar to SQL LEFT JOIN)
      profile: true,
    },
  });
  return user;
};
const getMyProfileIntoDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return result;
};
const updateMyProfileIntoDB = async (
  userId: string,
  payload: {
    name: string;
    role: string;
    profilePhoto: string;
    bio: string;
  },
) => {
  const { name, role, profilePhoto, bio } = payload;

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updateUser;
};
export const userService = {
  registerUserIntoDB,
  getMyProfileIntoDB,
  updateMyProfileIntoDB,
};
