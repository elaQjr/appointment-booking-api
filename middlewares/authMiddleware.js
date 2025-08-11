const { verifyToken } = require('../utils/token');
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "توکن ارائه نشده!" });
    }

    const token = authHeader.split(" ")[1];

    const result = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

    if (!result.valid) {
      if (result.expired) {
        return res.status(401).json({ message: "توکن منقضی شده!" });
      }
      return res.status(401).json({ message: result.message || "توکن نامعتبره!" });
    }

    req.user = await User.findById(result.decoded.id).select('-password');
    next();
  } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = authMiddleware;
