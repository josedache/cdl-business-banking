import { baseApi } from "configs/store-query";
import { USER } from "constants/tags.ts";
import {
  UserGetVoiceOtpApiRequest,
  UserGetVoiceOtpApiResponse,
  UserKycApiRequest,
  UserKycApiResponse,
  UserResetPasswordApiRequest,
  UserResetPasswordApiResponse,
  UserResetPasswordSendApiRequest,
  UserResetPasswordSendApiResponse,
  UserResetPasswordVerifyApiRequest,
  UserResetPasswordVerifyApiResponse,
  UserLoginApiRequest,
  UserLoginApiResponse,
  UserVerifyOtpApiRequest,
  UserVerifyOtpApiResponse,
  UserPinApiResponse,
  UserPinApiRequest,
  UserSendOtpApiResponse,
  UserSendOtpApiRequest,
  UserUpdateUsersDetailsRequest,
  UserUpdateUsersDetailsResponse,
  UserUpdatePasswordRequest,
  UserUpdatePasswordResponse,
  UserUpdatePinRequest,
  UserUpdatePinResponse,
  UserResendSignupLinkApiResponse,
  UserResendSignupLinkApiRequest,
} from "types/user-api.ts";

export const BASE_URL = "/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<UserLoginApiResponse, UserLoginApiRequest>({
      query: (config) => ({
        url: BASE_URL + "/login",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
    verifyUserOtp: builder.mutation<
      UserVerifyOtpApiResponse,
      UserVerifyOtpApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/verify-otp",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
    signupUser: builder.mutation({
      query: (config) => ({
        url: BASE_URL + "/sign-up",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
    getReferralCodeUser: builder.query({
      query: ({ ...config }) => ({
        url: BASE_URL + "/referral-code/",
        ...config,
      }),
      providesTags: [{ type: USER }],
    }),
    getUser: builder.query({
      query: (config) => ({
        url: BASE_URL,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: USER }],
    }),
    userKyc: builder.mutation<UserKycApiResponse, UserKycApiRequest>({
      query: (config) => ({
        url: BASE_URL + "/kyc",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    userPin: builder.mutation<UserPinApiResponse, UserPinApiRequest>({
      query: (config) => ({
        url: BASE_URL + "/pin",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    userSendOtp: builder.mutation<
      UserSendOtpApiResponse,
      UserSendOtpApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/send-otp",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    userGetVoiceOtp: builder.mutation<
      UserGetVoiceOtpApiResponse,
      UserGetVoiceOtpApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/get-otp-voice",
        method: "GET",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    sendUserResetPassword: builder.mutation<
      UserResetPasswordSendApiResponse,
      UserResetPasswordSendApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/forgot-password",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    verifyUserResetPassword: builder.mutation<
      UserResetPasswordVerifyApiResponse,
      UserResetPasswordVerifyApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/verify-forgot-password-otp",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    resetPassword: builder.mutation<
      UserResetPasswordApiResponse,
      UserResetPasswordApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/reset-password",
        method: "PATCH",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
    updateUsersDetails: builder.mutation<
      UserUpdateUsersDetailsResponse,
      UserUpdateUsersDetailsRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL,
        method: "PATCH",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
    updatePassword: builder.mutation<
      UserUpdatePasswordResponse,
      UserUpdatePasswordRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/update-password",
        method: "PATCH",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
    updatePin: builder.mutation<UserUpdatePinResponse, UserUpdatePinRequest>({
      query: ({ ...config }) => ({
        url: BASE_URL + "/pin",
        method: "PATCH",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),

    resendSignupLink: builder.mutation<
      UserResendSignupLinkApiResponse,
      UserResendSignupLinkApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/resend-signup-link",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: USER }],
    }),
  }),
});
