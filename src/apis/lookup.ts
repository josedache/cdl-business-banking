import { baseApi } from "configs/store-query";
import { LOOKUP } from "constants/tags";

import { BankLookupApiRequest, BankLookupApiResponse } from "types/lookup";

export const BASE_URL = "/lookup";

export const lookupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bankLookup: builder.query<BankLookupApiResponse, BankLookupApiRequest>({
      query: (config) => ({
        url: BASE_URL + "/banks",
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: LOOKUP }],
    }),
  }),
});
