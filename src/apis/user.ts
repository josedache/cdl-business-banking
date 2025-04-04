import { baseApi } from "configs/store-query";
import { USER } from "constants/tags.ts";

export const BASE_URL = "/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (config) => ({
        url: BASE_URL + "/login",
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
  }),
});
