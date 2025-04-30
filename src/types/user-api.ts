import { ApiRequest, ApiResponse } from "types/api.ts";
import { User } from "types/user.ts";

export type UserLoginApiRequest = ApiRequest<{
  email: string;
  password: string;
}>;

export type UserLoginApiResponse = ApiResponse<{
  token: string;
  expireTime: number;
  is_verified: number;
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
    | "verify_login_2fa"
    | "update_email";
  otp: string;
  rcNumber?: string;
  email?: string;
}>;

export type NinBvnInfo = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  nin: string;
  bvn: string;
  nationality: string;
  localGovernment: string;
  residentialAddress: string;
  image: string;
};

export type BusinessCacRegInfo = {
  name: string;
  registrationDate: string;
  address?: string;
  active?: boolean;
  companyType?: string;
};
export type UserVerifyOtpApiResponse = ApiResponse<{
  token: string;
  loginExpiry: number;
  login_expiry: number;
  refreshToken: string;
  refreshExpiry: number;
  user?: User;
  nin?: NinBvnInfo;
  bvn?: NinBvnInfo;
  business?: BusinessCacRegInfo;
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

export type UserResetPasswordSendApiRequest = ApiRequest<{
  email: string;
}>;

export type UserResetPasswordSendApiResponse = ApiResponse<{
  token: string;
  message: string;
  statusCode: string;
}>;

export type UserResetPasswordVerifyApiRequest = ApiRequest<{
  email: string;
  otp: string;
}>;

export type UserResetPasswordVerifyApiResponse = ApiResponse<{
  token: string;
}>;

export type UserResetPasswordApiRequest = ApiRequest<{
  email: string;
  password: string;
  confirmPassword: string;
}>;

export type UserResetPasswordApiResponse = ApiResponse;

export type UserKycApiRequest = ApiRequest<{
  nin?: string;
  bvn?: string;
}>;

export type UserKycApiResponse = ApiResponse<{
  expiry: number;
  phone: string;
  email?: string;
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

export type UserPinApiResponse = ApiResponse;

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

export type UserUpdateUsersDetailsRequest = ApiRequest<{
  oldEmail: string;
  newEmail: string;
}>;
export type UserUpdateUsersDetailsResponse = ApiResponse<unknown>;

export type UserUpdatePasswordRequest = ApiRequest<{
  newPassword: string;
  oldPassword: string;
  confirmNewPassword: string;
}>;
export type UserUpdatePasswordResponse = ApiResponse<unknown>;

export type UserUpdatePinRequest = ApiRequest<{
  oldPin: string;
  confirmNewPin: string;
  newPin: string;
}>;
export type UserUpdatePinResponse = ApiResponse<unknown>;

export type UserResendSignupLinkApiRequest = ApiRequest<{
  email: string;
}>;
export type UserResendSignupLinkApiResponse = ApiResponse<unknown>;
