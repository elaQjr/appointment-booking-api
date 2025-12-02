import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import fs from "fs";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // اگر فایلی آپلود شده و درخواست نامعتبر بود → حذف فایل
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting invalid file:", err);
      });
    }

    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};
