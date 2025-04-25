import { baseApi } from "configs/store-query";
import { WALLET } from "constants/tags";

import { GetWalletsApiRequest, GetWalletsApiResponse } from "types/wallet";

export const BASE_URL = "/wallet";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWallets: builder.query<GetWalletsApiResponse, GetWalletsApiRequest>({
      query: (config) => ({
        url: BASE_URL,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: WALLET }],
    }),
  }),
});
