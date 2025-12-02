import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import User from "../models/User";
import { IUserDocument } from "../models/User";

interface AuthRequest extends Request {
  user?: IUserDocument;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "توکن ارائه نشده!" });
    }

    const token = authHeader.split(" ")[1];

    const result = verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    if (!result.valid) {
      if (result.expired) {
        return res.status(401).json({ message: "توکن منقضی شده!" });
      }
      return res
        .status(401)
        .json({ message: result.message || "توکن نامعتبره!" });
    }

    if (!result.decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = (await User.findById(result.decoded.id).select(
      "-password"
    )) as IUserDocument;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default authMiddleware;
