import { ApiRequest, ApiResponse } from "types/api.ts";
import { User } from "types/user.ts";

export type UserLoginApiRequest = ApiRequest<{
  email: string;
  password: string;
}>;

export type UserLoginApiResponse = ApiResponse<{
  token: string;
  expireTime: number;
  message: string;
}>;

export type UserVerifyOtpApiRequest = ApiRequest<{
  reason: string;
  otp: string;
}>;

export type UserVerifyOtpApiResponse = ApiResponse<{
  token: string;
  loginExpiry: number;
  refreshToken: string;
  refreshExpiry: number;
  user: User;
}>;

export type UserSignupApiRequest = ApiRequest<{
  phone?: string;
  email: string;
  firstName?: string;
  confirmPassword: string;
  password: string;
  middleName?: string;
  lastName?: string;
  acceptedTermsAndConditions: boolean;
  referralCode?: string;
}>;

export type UserSignupApiResponse = ApiResponse<{
  token: string;
  expireTime: number;
  message: string;
}>;

export type UserApiRequest = ApiRequest;

export type UserApiResponse = ApiResponse<User>;
