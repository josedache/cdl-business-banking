import { baseApi } from "configs/store-query";
import { LOOKUP } from "constants/tags";

import {
  BankLookupApiRequest,
  BankLookupApiResponse,
  sectorsLookupApiResponse,
  StateAddressLookupApiRequest,
  StateAddressLookupApiResponse,
  SubSectorsLookupApiRequest,
  SubSectorsLookupApiResponse,
} from "types/lookup";

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
    sectorsLookup: builder.query<sectorsLookupApiResponse, void>({
      query: () => ({
        url: BASE_URL + "/sectors",
        method: "GET",
      }),
      providesTags: [{ type: LOOKUP }],
    }),
    subSectorsLookup: builder.query<
      SubSectorsLookupApiResponse,
      SubSectorsLookupApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + "/sectors/" + path?.sectorId,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: LOOKUP }],
    }),
    stateAddressLookup: builder.query<
      StateAddressLookupApiResponse,
      StateAddressLookupApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + "/states/" + `${path?.stateId ?? ""}`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: LOOKUP }],
    }),
  }),
});
