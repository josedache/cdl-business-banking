import { baseApi } from "configs/store-query";
import { ENQUIRY } from "constants/tags";

import { NameEnquiryApiRequest, NameEnquiryApiResponse } from "types/enquiry";

export const BASE_URL = "/enquiry";

export const enquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    nameEnquiry: builder.mutation<
      NameEnquiryApiResponse,
      NameEnquiryApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/bank",
        method: "post",
        ...config,
      }),
      invalidatesTags: [{ type: ENQUIRY }],
    }),
  }),
});
