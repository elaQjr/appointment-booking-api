import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../models/User";
import * as fs from "fs";

// ------------- GET PROFILE -----------------
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { _id, name, email, role, avatar } = req.user;

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: { _id, name, email, role, avatar },
    });
  } catch (err) {
    next(err);
  }
};

// ------------- UPLOAD AVATAR ---------------
export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file sent" });
    }

    const user: IUserDocument | null = await User.findById(req.user._id);
    if (!user) {
      try {
        fs.unlinkSync(req.file.path); // پاک کردن فایل آپلودی در صورت نبود کاربر
      } catch (fileErr) {
        console.error("Error deleting file:", fileErr);
      }
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      data: { imageUrl: user.avatar },
    });
  } catch (err) {
    // حذف فایل آپلود شده در صورت بروز خطا
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileErr) {
        console.error("Error deleting file on catch:", fileErr);
      }
    }
    next(err);
  }
};
