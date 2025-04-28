import { baseApi } from "configs/store-query";

import { MERCHANT, USER } from "constants/tags.ts";
import {
  GetMerchantBusinessDataApiRequest,
  GetMerchantBusinessDataApiResponse,
  MerchantAddressStatesApiRequest,
  MerchantAddressStatesApiResponse,
  MerchantBusinessDirectorsApiRequest,
  MerchantBusinessDirectorsApiResponse,
  MerchantBusinessProfileApiRequest,
  MerchantBusinessProfileApiResponse,
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
        method: "POST",
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

    getMerchantBusinessProfile: builder.query<
      MerchantBusinessProfileApiResponse,
      MerchantBusinessProfileApiRequest
    >({
      query: (config) => ({
        url: BASE_URL,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: USER }],
    }),
    getMerchantBusinessDirectors: builder.query<
      MerchantBusinessDirectorsApiResponse,
      MerchantBusinessDirectorsApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + "/directors/" + path.rcNumber,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: USER }],
    }),

    merchantAddressDetails: builder.mutation<
      MerchantAddressStatesApiResponse,
      MerchantAddressStatesApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + "/address/" + path.rcNumber,
        method: "POST",
        ...config,
      }),
      invalidatesTags: [{ type: MERCHANT }],
    }),
  }),
});
