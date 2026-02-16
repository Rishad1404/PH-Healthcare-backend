import { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { jwtUtils } from "./jwt";
import { Response } from "express";
import { CookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET as string,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET as string,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return refreshToken;
};


const setAccessTokenCookie=(res:Response,token:string)=>{
    CookieUtils.setCookie(res,"accessToken",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        // 1 day
        maxAge:60*60*60*24
    })
}


const setRefreshTokenCookie=(res:Response,token:string)=>{
    CookieUtils.setCookie(res,"refreshToken",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:"/",
        // 7 day
        maxAge:60*60*60*24*7
    })
}


const betterAuthSessionCookie=(res:Response,token:string)=>{
    CookieUtils.setCookie(res,"better-auth.session_token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:"/",
        // 1 day
        maxAge:60*60*60*24
    })
}


export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    betterAuthSessionCookie
}
