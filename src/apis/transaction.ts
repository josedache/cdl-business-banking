import { baseApi } from "configs/store-query";

import { TRANSACTION } from "constants/tags.ts";
import {
  GenerateTransactionReceiptApiRequest,
  GenerateTransactionReceiptApiResponse,
  GetTransactionSavingsHistoryApiRequest,
  GetTransactionSavingsHistoryApiResponse,
  GetTransactionLimitApiRequest,
  GetTransactionLimitApiResponse,
  GetTransactionApiResponse,
  GetTransactionApiRequest,
} from "types/transaction-api";
import { downloadUrl } from "utils/file/downloadUrl";

export const BASE_URL = "/transaction";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionSavingsHistory: builder.query<
      GetTransactionSavingsHistoryApiResponse,
      GetTransactionSavingsHistoryApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/history/${path.savingsAccountId}`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),

    getTransaction: builder.query<
      GetTransactionApiResponse,
      GetTransactionApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/${path?.id}`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),

    getTransactionLimit: builder.query<
      GetTransactionLimitApiResponse,
      GetTransactionLimitApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + `/limit`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),

    generateTransactionReceipt: builder.mutation<
      GenerateTransactionReceiptApiResponse,
      GenerateTransactionReceiptApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/${path?.id}/receipt`,
        method: "GET",
        ...config,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          downloadUrl(data?.data?.pdf, data?.data?.pdf);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});
