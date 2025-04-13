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
  reason:
    | "verify_bvn"
    | "verify_email"
    | "verify_nin"
    | "verify_main_phone_number"
    | "verify_business"
    | "complete_transfer"
    | "verify_login_2fa";
  otp: string;
  rcNumber?: string;
}>;

export type UserVerifyOtpApiResponse = ApiResponse<{
  token: string;
  loginExpiry: number;
  login_expiry: number;
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

export type UserKycApiRequest = ApiRequest<{
  nin?: string;
  bvn?: string;
}>;

export type UserKycApiResponse = ApiResponse<{
  expiry: number;
  phone: string;
}>;

export type UserPinApiRequest = ApiRequest<
  {
    pin: string;
  },
  void,
  {
    action: "create" | "confirm";
  }
>;

export type UserPinApiResponse = ApiResponse<{}>;

export type UserSendOtpApiRequest = ApiRequest<{
  reason:
    | "verify_bvn"
    | "verify_email"
    | "verify_nin"
    | "verify_main_phone_number"
    | "verify_business"
    | "complete_transfer"
    | "verify_login_2fa";
}>;

export type UserSendOtpApiResponse = ApiResponse<{
  token: string;
  loginExpiry: number;
  refreshToken: string;
  refreshExpiry: number;
  user: User;
}>;

export type UserGetVoiceOtpApiRequest = ApiRequest<unknown>;

export type UserGetVoiceOtpApiResponse = ApiResponse<unknown>;
