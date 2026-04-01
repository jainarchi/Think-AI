import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import {
  ApiError,
  createConflictError,
  createNotFoundError,
  createUnauthorizedError,
} from "../utils/errorHandler.js";
import redis from '../config/cache.js'



/**
 * send verification email on user's email address
 * call from register and resend email controller
 */

async function sendVerificationEmail(username , email) {

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })

  await sendEmail({
    to: email,
    subject: "Welcome to Infra AI",
    html: `
        <p>Hi ${username},</p>
        <p>Thanks for registering at <strong>Infra AI</strong>. We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${token}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,</p>
        <p>The Infra AI Team</p>
        `,
  });
    
}

/**
 * @desc Send password reset link to the user's email.
 */

async function sendResetPasswordEmail(username, email) {

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>Hi ${username},</p>
      <p>You requested to reset your password.</p>
      <p>Click the link below to set a new password:</p>
      
      <a href="http://localhost:5173/reset-password?token=${token}">
        Reset Password
      </a>

      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>

      <p>Infra AI Team</p>
    `
  });
}


/**
 * @route POST api/auth/register
 * @desc new user create in DB and call sendVerificationEmail
 */

async function register(req, res) {
  const { username, email, password } = req.body;

  const userAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userAlreadyExists) {
    throw new ApiError(409, "User already exists", [
      {
        field: userAlreadyExists.username === username ? "username" : "email",
        message: `${userAlreadyExists.username === username ? "Username" : "Email"} already exists`,
      },
    ]);
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  // link send for verifitcation
  await sendVerificationEmail(username, email);

  res.status(201).json({
    message:
      "Registered successfully. Please check your email to verify your account",
      success: true,
  });
}



/**
 * @route POST api/auth/resend-verification
 * @desc resend verification link on email at the time of register or at login if account not verified
 */

async function resendVerificationEmail(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw createNotFoundError("user not found");
  }

  if (user.verified) {
    throw new ApiError(400, "Account already verified. Please login.", [
      {
        field: "email",
        message: "This email address is already verified",
      },
    ])
  }

  await sendVerificationEmail(user.username, email);

  res.status(200).json({
    message: "Verification email resend successfully",
    success: true,
  });
}




/**
 * @route GET  api/auth/verify-email
 * @desc this controller call when user click on verification link 
 * verify token then set user verfied status to true
 * show button go to login
 * @access public
 */
async function verifyEmail(req, res) {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Verification token not found", [
      {
        field: "token",
        message: "Token is required",
      },
    ]);
  }

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token", [
      {
        field: "token",
        message: err.message,
      },
    ]);
  }

  const user = await userModel.findOne({
    email: decoded.email,
  });

  if (!user) {
    throw createNotFoundError("User");
  }

  user.verified = true;
  await user.save();

  // show page for email successfully verified
  const html = `
  <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
    <h1 style="color: #4CAF50;">Email Verified Successfully!</h1>
    <p style="font-size: 18px;">
    Your email has been verified. You can now log in to your account.</p>
    <a href="http://localhost:3000/login" 
    style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Go to Login</a>
  </div>
  `;

  res.send(html);
}


/**
 * @route /api/auth/login
 * @desc user logged in our account
 * @access public
 * @body { email , password }
 */


async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw createUnauthorizedError("Invalid email or password");
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw createUnauthorizedError("Invalid email or password");
  }

  if (!user.verified) {
     await sendVerificationEmail(user.username, user.email)

    throw new ApiError(403, "Please verify your account before logging, verification link sent to your email.", [
      {
        field: "email",
        message: "Email not verified",
      },
    ])

  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);
  user.password = undefined;

  res.status(200).json({
    message: "Logged In Successfully",
    success: true,
    user,
  });
}



/**
 * @route POST api/auth/forget-password
 * @desc send email to reset password when user forget password at the time of login
 * @access public
 */

async function forgetPassword(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw createNotFoundError("User with this email")
  }

  // sending email to reset password
  await sendResetPasswordEmail(user.username, user.email)

  res.status(200).json({
    message: "Password reset email sent successfully",
    success: true,
  })
}



/**
 * @route POST api/auth/forget-password
 * @desc  user click on link to reset password after enter new password 
 * @access public
 * @query {token}
 */

async function resetPassword(req, res) {
  const { token } = req.query;
  const { newPassword } = req.body;

  if (!token) {
    throw createUnauthorizedError("Reset token not provided");
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token", [
      {
        field: "token",
        message: err.message,
      },
    ])
  }

  const user = await userModel.findOne({
    email: decoded.email,
  })

   

  if (!user) {
    throw createNotFoundError("User");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
    success: true,
  });
}





/**
 * @route Get /api/auth/get-me
 * @desc give details of current logged In user
 * @access private
 */

async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    throw createNotFoundError("User");
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}


async function logout(req ,res) {

  const token = req.cookies.token
  res.clearCookie("token")

  await redis.set(token, "blacklisted" , "EX", 60 * 60 * 24 * 7)

  res.status(200)
  .json({
    message : 'successfully logout',
    success : true 
  })

}








export default {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  forgetPassword,
  resetPassword,
  logout
};
