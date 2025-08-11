const multer = require("multer");
const fs = require("fs");
const path = require("path");
const upload = require("./upload");

const uploadMiddleware = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file: ", unlinkErr);
          });
        }

        return res
          .status(400)
          .json({ message: err.message || "Upload error: file size or other limitation" });
      }

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

module.exports = uploadMiddleware;
