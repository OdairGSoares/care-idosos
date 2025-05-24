import { sign, Secret, SignOptions  } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN;

if (!secretKey) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
}

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = ({ userId, email }: TokenPayload): string => {
  const payload = { userId, email};

  const signOptions: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  const token = sign(payload, secretKey, signOptions);

  return token;
};