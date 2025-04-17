import { baseApi } from "configs/store-query";

import { BENEFICIARY, TRANSFER } from "constants/tags.ts";
import {
  BulkTransferOtpVerificationApiRequest,
  BulkTransferOtpVerificationApiResponse,
  BulkTransferTransactionVerificationApiRequest,
  BulkTransferTransactionVerificationApiResponse,
  CompleteTransferApiRequest,
  CompleteTransferApiResponse,
  GetTransferBulkSummariesApiRequest,
  GetTransferBulkSummariesApiResponse,
  GetTransferBulkSummaryApiRequest,
  GetTransferBulkSummaryApiResponse,
  GetTransferWalletsApiRequest,
  GetTransferWalletsApiResponse,
  TransferApiRequest,
  TransferApiResponse,
  TransferBulkApiRequest,
  TransferBulkApiResponse,
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
    bulkTransfer: builder.mutation<
      TransferBulkApiResponse,
      TransferBulkApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/bulk",
        method: "post",
        headers: {
          "x-channel-code": "web",
        },
        ...config,
      }),
      invalidatesTags: [{ type: TRANSFER }],
    }),
    bulkTransferOtpVerification: builder.mutation<
      BulkTransferOtpVerificationApiResponse,
      BulkTransferOtpVerificationApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/bulk/${path?.batchNumber}/otp`,
        method: "PATCH",
        headers: {
          "x-channel-code": "web",
        },
        ...config,
      }),
      invalidatesTags: [{ type: TRANSFER }],
    }),
    bulkTransferPinVerification: builder.mutation<
      BulkTransferTransactionVerificationApiResponse,
      BulkTransferTransactionVerificationApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/bulk/${path?.batchNumber}/pin`,
        method: "PATCH",
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
    getTransferBulkSummaries: builder.query<
      GetTransferBulkSummariesApiResponse,
      GetTransferBulkSummariesApiRequest
    >({
      query: (config) => ({
        url: BASE_URL + "/bulk/summary",
        method: "GET",
        ...config,
      }),
    }),
    getTransferBulkSummary: builder.query<
      GetTransferBulkSummaryApiResponse,
      GetTransferBulkSummaryApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/bulk/summary/${path?.batchNumber}`,
        method: "GET",
        ...config,
      }),
    }),
  }),
});
