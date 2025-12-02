import { Request, Response, NextFunction } from "express";
import User,{ IUser } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
  generateHashedToken,
  verifyToken,
} from "../utils/token";
import sendEmail from "../utils/sendEmail";

// Email Templates
import generateVerificationEmail from "../utils/emailTemplates/verificationEmail";
import generateResendVerificationEmail from "../utils/emailTemplates/resendVerificationEmail";
import generateResetPassword from "../utils/emailTemplates/resetPasswordEmail";

// Body Request types
interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  newPassword: string;
}

//-------------- REGISTER -------------------------
export const register = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    const { token, hashedToken } = generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires =
      new Date (Date.now() + Number(process.env.EMAIL_VERIFICATION_EXPIRY));

    await user.save();

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email/${token}`;
    const htmlMessage = generateVerificationEmail(user.name, verificationUrl);

    await sendEmail({
      to: user.email,
      subject: "Email Verification",
      html: htmlMessage,
    });

    res.status(201).json({
      success: true,
      message: "User registered. Verification email sent.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ------------- VERIFY EMAIL --------------
export const verifyEmail = async (req: Request<{ token: string }>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });

    const hashedToken = generateHashedToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Token is invalid or expired" });

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Email successfully verified! You can now log in.",
      });
  } catch (err) {
    next(err);
  }
};

// ------------ RESEND VERIFICATION EMAIL ------------
export const resendVerificationEmail = async (req: Request<{}, {}, ForgotPasswordBody>, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.isVerified) {
      return res
        .status(200)
        .json({
          success: true,
          message: "If the email is valid, a verification link will be sent.",
        });
    }

    const { token, hashedToken } = generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires =
      new Date (Date.now() + Number(process.env.EMAIL_VERIFICATION_EXPIRY));

    await user.save();

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email/${token}`;
    const htmlMessage = generateResendVerificationEmail(
      user.name,
      verificationUrl
    );

    await sendEmail({
      to: user.email,
      subject: "Resend Email Verification",
      html: htmlMessage,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "If the email is valid, a verification link will be sent.",
      });
  } catch (err) {
    next(err);
  }
};

//-------------- LOGIN ----------------------------
export const login = async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// ------------- REFRESH TOKEN ---------------------
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshtoken = req.cookies["refreshToken"];
    if (!refreshtoken) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Access Denied. No refresh token provided.",
        });
    }

    const result = verifyToken(refreshtoken, process.env.REFRESH_TOKEN_SECRET as string);
    if (!result?.decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    const user = await User.findById(result.decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    const accessToken = generateAccessToken(result.decoded.id);
    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// ------------ FORGOT PASSWORD --------------
export const forgotPassword = async (req: Request<{}, {}, ForgotPasswordBody>, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res
        .status(200)
        .json({
          success: true,
          message: "If the email is valid, a reset link will be sent.",
        });
    }

    const { token, hashedToken } = generateTemporaryToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires =
      new Date (Date.now() + Number(process.env.PASSWORD_RESET_EXPIRY));

    await user.save({ validateBeforeSave: false });

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${token}`;
    const htmlMessage = generateResetPassword(user.name, resetLink);

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: htmlMessage,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "If the email is valid, a reset link will be sent.",
      });
  } catch (err) {
    next(err);
  }
};

// ------------- RESET PASSWORD ------------
export const resetPassword = async (req: Request<{ token: string }, {}, ResetPasswordBody>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword)
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });

    const hashedToken = generateHashedToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Token is invalid or expired" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// -------------- LOG OUT -------------
export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logout was successful" });
};
