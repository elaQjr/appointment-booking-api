import jwt, { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import crypto from 'crypto';

export interface VerifyTokenResult {
  valid: boolean;
  expired: boolean;
  decoded: JwtPayload | null;
  message?: string;
}

// ------------------------ Generate Access Token ------------------------
export const generateAccessToken = (userId: string): string => {

  const secret: Secret = process.env.ACCESS_TOKEN_SECRET!;
  
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
  
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d" as any;

  const options: SignOptions = {expiresIn};

  return jwt.sign({ id: userId }, secret, options);
};

// ------------------------ Generate Refresh Token ------------------------
export const generateRefreshToken = (userId: string): string => {

  const secret: Secret = process.env.REFRESH_TOKEN_SECRET!;

  if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
  
  const expiresIn = process.env.JWT_EXPIRES_REFRESH_TOKEN || "7d" as any;

  const options: SignOptions = {expiresIn}

  return jwt.sign({ id: userId}, secret, options);
};

// ------------------------ Verify Token ------------------------
export const verifyToken = (token: string, jwtSecret: string): VerifyTokenResult => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return { valid: true, expired: false, decoded };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, expired: true, decoded: null, message: "توکن منقضی شده" };
    } else if (err.name === "JsonWebTokenError") {
      return { valid: false, expired: false, decoded: null, message: "توکن نامعتبره" };
    } else if (err.name === "NotBeforeError") {
      return { valid: false, expired: false, decoded: null, message: "توکن هنوز معتبر نشده" };
    } else {
      return { valid: false, expired: false, decoded: null, message: "خطای ناشناخته" };
    }
  }
};

// ------------------------ Generate Temporary Token ------------------------
export const generateTemporaryToken = (): { token: string; hashedToken: string } => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return { token, hashedToken }
};

// ------------------------ Generate Hashed Token ------------------------
export const generateHashedToken = (token: string): string => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};

