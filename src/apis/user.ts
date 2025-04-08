import { baseApi } from "configs/store-query";
import { USER } from "constants/tags.ts";
import {
  UserLoginApiRequest,
  UserLoginApiResponse,
  UserResetPasswordApiRequest,
  UserResetPasswordApiResponse,
  UserResetPasswordSendApiRequest,
  UserResetPasswordSendApiResponse,
  UserResetPasswordVerifyApiRequest,
  UserResetPasswordVerifyApiResponse,
  UserVerifyOtpApiRequest,
  UserVerifyOtpApiResponse,
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
      query: ({ path, ...config }) => ({
        url: BASE_URL + "/get_ref_code/" + path.referral_code,
        method: "GET",
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
    
    sendUserResetPassword : builder.mutation<
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
    invalidatesTags:  [{ type: USER }],
  }),

  resetPassword: builder.mutation<
  UserResetPasswordApiResponse,
  UserResetPasswordApiRequest
>({
  query: ({ ...config }) => ({
    url: BASE_URL + "/reset-password",
    method: "patch",
    ...config,
  }),
  invalidatesTags: [{ type: USER }],
}),
  }),
});
