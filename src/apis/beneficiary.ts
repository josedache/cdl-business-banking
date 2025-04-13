import { baseApi } from "configs/store-query";

import { BENEFICIARY } from "constants/tags.ts";
import {
  GetBeneficiaryApiRequest,
  GetBeneficiaryApiResponse,
} from "types/beneficiary";

export const BASE_URL = "/beneficiary";

export const beneficiaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBeneficiaries: builder.query<
      GetBeneficiaryApiResponse,
      GetBeneficiaryApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/beneficiary",
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),
  }),
});
