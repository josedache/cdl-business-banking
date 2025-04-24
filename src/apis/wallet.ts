import { baseApi } from "configs/store-query";

import {
  GetTransferWalletsApiRequest,
  GetTransferWalletsApiResponse,
} from "types/transfer";

export const BASE_URL = "/wallet";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransferWallets: builder.query<
      GetTransferWalletsApiResponse,
      GetTransferWalletsApiRequest
    >({
      query: (config) => ({
        url: BASE_URL,
        method: "GET",
        ...config,
      }),
    }),
  }),
});
