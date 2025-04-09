import { baseApi } from "configs/store-query";

import { MERCHANT, USER } from "constants/tags.ts";
import {
  GetMerchantBusinessDataApiRequest,
  GetMerchantBusinessDataApiResponse,
  MerchantRegistrationCacApiRequest,
  MerchantRegistrationCacApiResponse,
  MerchantRegistrationNonCacApiRequest,
  MerchantRegistrationNonCacApiResponse,
} from "types/merchant";

export const BASE_URL = "/merchant";

export const merchantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    merchantRegistrationNonCac: builder.mutation<
      MerchantRegistrationNonCacApiResponse,
      MerchantRegistrationNonCacApiRequest
    >({
      query: (config) => ({
        url: BASE_URL,
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: MERCHANT }],
    }),
    merchantRegistrationCac: builder.mutation<
      MerchantRegistrationCacApiResponse,
      MerchantRegistrationCacApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/kyb",
        method: "GET",
        ...config,
      }),
      invalidatesTags: [{ type: MERCHANT }],
    }),

    getMerchantBusinessData: builder.query<
      GetMerchantBusinessDataApiResponse,
      GetMerchantBusinessDataApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/business-data",
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: USER }],
    }),
  }),
});
