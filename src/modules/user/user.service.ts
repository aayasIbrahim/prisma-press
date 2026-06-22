import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { RegisterUser } from "./user.interface";
import config from "../../config";

const registerUserIntoDB = async (payload: RegisterUser) => {
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
    },
  });

  await prisma.profile.create({
    data: {
      userId: newUser.id,
      profilePhoto,
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
export const userService = {
  registerUserIntoDB,
};
