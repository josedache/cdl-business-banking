import { baseApi } from "configs/store-query";

import { TRANSACTION } from "constants/tags.ts";
import {
  GenerateTransactionReceiptApiRequest,
  GenerateTransactionReceiptApiResponse,
  GetTransactionApiRequest,
  GetTransactionApiResponse,
  GetTransactionLimitApiRequest,
  GetTransactionLimitApiResponse,
} from "types/transaction-api";

export const BASE_URL = "/transaction";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransaction: builder.query<
      GetTransactionLimitApiResponse,
      GetTransactionLimitApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "",
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),

    getTransactionLimit: builder.query<
      GetTransactionApiResponse,
      GetTransactionApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/${path?.transactionId}`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),

    generateTransactionReceipt: builder.query<
      GenerateTransactionReceiptApiResponse,
      GenerateTransactionReceiptApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/${path?.transactionId}/receipt`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),
  }),
});
