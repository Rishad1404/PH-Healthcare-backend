import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.registerPatient(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.betterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
        }
        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.betterAuthSessionCookie(res, sessionToken);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    }
)

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(payload, sessionToken);

  const { accessToken, refreshToken,token } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.betterAuthSessionCookie(res, token as string);


  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const logOutUser=catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logOutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res,"better-auth.session_token",{
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res,"refreshToken",{
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
  CookieUtils.clearCookie(res,"accessToken",{
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email verified successfully"
  });
});

export const AuthController = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail
};
