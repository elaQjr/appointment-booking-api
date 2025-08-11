const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_REFRESH_TOKEN || "7d",
  });
};

const verifyToken = (token, jwtSecret) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return { valid: true, expired: false, decoded };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, expired: true, decoded: null };
    } else if (err.name === "JsonWebTokenError") {
      return { valid: false, expired: false, decoded: null, message: "توکن نامعتبره" };
    } else if (err.name === "NotBeforeError") {
      return { valid: false, expired: false, decoded: null, message: "توکن هنوز معتبر نشده" };
    } else {
      return { valid: false, expired: false, decoded: null, message: "خطای ناشناخته" };
    }
  }
};

const generateTemporaryToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return { token, hashedToken }
};

const generateHashedToken = (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateTemporaryToken,
    generateHashedToken
    
};
