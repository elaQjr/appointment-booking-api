import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

const authorize = (...allowedRoles: Array<"user" | "admin">) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userRoles = req.user.role;

    if (!allowedRoles.includes(userRoles)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

export default authorize;
