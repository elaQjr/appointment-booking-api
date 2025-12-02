import multer, { MulterError } from "multer";
import fs from "fs";
import path from "path";
import upload from "./upload";
import { Request, Response, NextFunction } from "express";

const uploadMiddleware = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err instanceof MulterError || err) {
        // اگر خطا بود، فایل آپلودشده پاک بشه
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file: ", unlinkErr);
          });
        }

        return res.status(400).json({
          message: err.message || "Upload error: file size or other limitation",
        });
      }

      // تغییر نام آواتار بعد از آپلود
      if (req.file && fieldName === "avatar" && req.user) {
        const ext = path.extname(req.file.originalname);
        const newFilename = `avatar-${req.user.id}-${Date.now()}${ext}`;
        const newPath = path.join("uploads", newFilename);

        fs.renameSync(req.file.path, newPath);

        req.file.filename = newFilename;
        req.file.path = newPath;
      }

      next();
    });
  };
};

export default uploadMiddleware;
