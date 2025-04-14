import { baseApi } from "configs/store-query";

import { BENEFICIARY, TRANSFER } from "constants/tags.ts";
import {
  CompleteTransferApiRequest,
  CompleteTransferApiResponse,
  GetTransferWalletsApiRequest,
  GetTransferWalletsApiResponse,
  TransferApiRequest,
  TransferApiResponse,
} from "types/transfer";

export const BASE_URL = "/transfer";

export const transferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    transfer: builder.mutation<TransferApiResponse, TransferApiRequest>({
      query: (config) => ({
        url: BASE_URL,
        method: "post",
        headers: {
          "x-channel-code": "web",
        },
        ...config,
      }),
      invalidatesTags: [{ type: TRANSFER }],
    }),
    getTransferWallets: builder.query<
      GetTransferWalletsApiResponse,
      GetTransferWalletsApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/wallets",
        method: "GET",
        ...config,
      }),
      // providesTags: [{ type: TRANSFER }],
    }),
    completeTransfer: builder.mutation<
      CompleteTransferApiResponse,
      CompleteTransferApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/${path.reference}/complete`,
        method: "PATCH",
        headers: {
          "x-channel-code": "web",
        },
        ...config,
      }),
      invalidatesTags: [{ type: TRANSFER }, { type: BENEFICIARY }],
    }),
  }),
});
