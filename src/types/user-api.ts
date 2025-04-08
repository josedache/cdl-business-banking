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

export type UserApiRequest = ApiRequest;

export type UserApiResponse = ApiResponse<User>;

export type UserResetPasswordSendApiRequest = ApiRequest<{
  email: string;
}>;

export type UserResetPasswordSendApiResponse = ApiResponse<{
  token: string;
  message: string;
  statusCode :string;
}>;

export type UserResetPasswordVerifyApiRequest = ApiRequest<{
  email:string;
  otp: string;
}>;

export type UserResetPasswordVerifyApiResponse = ApiResponse<{
  token:string;
}>;

export type UserResetPasswordApiRequest = ApiRequest<{
  email:string;
  password:string;
  confirmPassword :string;
}>;

export type UserResetPasswordApiResponse = ApiResponse<{
 
}>;