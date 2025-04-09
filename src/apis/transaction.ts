import { baseApi } from "configs/store-query";

import { TRANSACTION } from "constants/tags.ts";
import {
  GetTransactionLimitApiRequest,
  GetTransactionLimitApiResponse,
} from "types/transaction-api";

export const BASE_URL = "/transaction";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionLimit: builder.query<
      GetTransactionLimitApiResponse,
      GetTransactionLimitApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/limit",
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: TRANSACTION }],
    }),
  }),
});
