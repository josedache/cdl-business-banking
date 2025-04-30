import { baseApi } from "configs/store-query";

import { BENEFICIARY } from "constants/tags.ts";
import {
  CreateBeneficiaryApiRequest,
  CreateBeneficiaryApiResponse,
  DeleteBeneficiaryBatchReportApiRequest,
  DeleteBeneficiaryBatchReportApiResponse,
  DownloadBeneficiariesTemplateSampleRequest,
  DownloadBeneficiariesTemplateSampleResponse,
  GetBeneficiariesApiRequest,
  GetBeneficiariesApiResponse,
  GetBeneficiariesTemplateSampleRequest,
  GetBeneficiariesTemplateSampleResponse,
  GetBeneficiaryApiRequest,
  GetBeneficiaryApiResponse,
  GetBeneficiaryBatchApiRequest,
  GetBeneficiaryBatchApiResponse,
  GetBeneficiaryBatchesApiResponse,
  GetBeneficiaryBatchReportApiRequest,
  GetBeneficiaryBatchReportApiResponse,
  GetBeneficiaryBatchSummaryApiRequest,
  GetBeneficiaryBatchSummaryApiResponse,
  ProcessBeneficiaryBatchApiRequest,
  ProcessBeneficiaryBatchApiResponse,
  ResolveDuplicateBeneficiaryRequest,
  ResolveDuplicateBeneficiaryResponse,
  UpdateBeneficiaryApiRequest,
  UpdateBeneficiaryApiResponse,
  UpdateBeneficiaryBatchApiRequest,
  UpdateBeneficiaryBatchApiResponse,
} from "types/beneficiary";
import { downloadUrl } from "utils/file/downloadUrl";

export const BASE_URL = "/beneficiary";

export const beneficiaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBeneficiaries: builder.query<
      GetBeneficiariesApiResponse,
      GetBeneficiariesApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    getBeneficiary: builder.query<
      GetBeneficiaryApiResponse,
      GetBeneficiaryApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    createBeneficiary: builder.mutation<
      CreateBeneficiaryApiResponse,
      CreateBeneficiaryApiRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL,
        method: "POST",
        ...config,
      }),
      invalidatesTags: [{ type: BENEFICIARY }],
    }),

    updateBeneficiary: builder.mutation<
      UpdateBeneficiaryApiResponse,
      UpdateBeneficiaryApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/${path?.beneficiaryId}`,
        method: "PUT",
        ...config,
      }),
      invalidatesTags: [{ type: BENEFICIARY }],
    }),

    getBeneficiariesTemplateSample: builder.query<
      GetBeneficiariesTemplateSampleResponse,
      GetBeneficiariesTemplateSampleRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/template/sample",
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    downloadBeneficiariesTemplateSample: builder.query<
      DownloadBeneficiariesTemplateSampleResponse,
      DownloadBeneficiariesTemplateSampleRequest
    >({
      query: ({ ...config }) => ({
        url: BASE_URL + "/template/sample/download",
        method: "GET",
        ...config,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          downloadUrl(
            data?.data?.downloadUrl?.downloadUrl,
            data?.data?.downloadUrl?.downloadUrl
          );
        } catch (error) {
          console.error(error);
        }
      },
      providesTags: [{ type: BENEFICIARY }],
    }),

    processBeneficiaryBatch: builder.mutation<
      ProcessBeneficiaryBatchApiResponse,
      ProcessBeneficiaryBatchApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/batch/${path?.batchNumber}`,
        method: "POST",
        ...config,
      }),
      invalidatesTags: [{ type: BENEFICIARY }],
    }),

    updateBeneficiaryBatch: builder.mutation<
      UpdateBeneficiaryBatchApiResponse,
      UpdateBeneficiaryBatchApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/batch/${path?.batchNumber}/name`,
        method: "PUT",
        ...config,
      }),
      invalidatesTags: [{ type: BENEFICIARY }],
    }),

    getBeneficiaryBatch: builder.query<
      GetBeneficiaryBatchApiResponse,
      GetBeneficiaryBatchApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/batch/${path?.batchNumber}`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    getBeneficiaryBatches: builder.query<
      GetBeneficiaryBatchesApiResponse,
      void
    >({
      query: () => ({
        url: BASE_URL + `/batch`,
        method: "GET",
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    getBeneficiaryBatchReport: builder.query<
      GetBeneficiaryBatchReportApiResponse,
      GetBeneficiaryBatchReportApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/batch/${path?.batchNumber}/report`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    getBeneficiaryBulkSummary: builder.query<
      GetBeneficiaryBatchSummaryApiResponse,
      GetBeneficiaryBatchSummaryApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/bulk/summary/${path?.batchNumber}`,
        method: "GET",
        ...config,
      }),
      providesTags: [{ type: BENEFICIARY }],
    }),

    resolveDuplicateBeneficiary: builder.mutation<
      ResolveDuplicateBeneficiaryResponse,
      ResolveDuplicateBeneficiaryRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/batch/${path?.batchNumber}/duplicate/resolve`,
        method: "GET",
        ...config,
      }),
      invalidatesTags: [{ type: BENEFICIARY }],
    }),

    deleteBeneficiaryBatchReport: builder.mutation<
      DeleteBeneficiaryBatchReportApiResponse,
      DeleteBeneficiaryBatchReportApiRequest
    >({
      query: ({ path, ...config }) => ({
        url: BASE_URL + `/batch/report/${path?.batchNumber}`,
        method: "DELETE",
        ...config,
      }),
      invalidatesTags: [{ type: BENEFICIARY }],
    }),
  }),
});
