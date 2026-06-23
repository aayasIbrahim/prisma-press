import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};
const verifyToken = (token: string, secret: Secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return verifiedToken;
  } catch (error:any) {
    console.log("Token Varification Error",error)
    throw new Error(error.message);
  }
};
export const jwtUtils = {
  createToken,
  verifyToken,
};
