import { baseApi } from "configs/store-query";

import { FileUploadApiRequest, FileUploadApiResponse } from "types/upload";
import objectToFormData from "utils/object/object-to-formdata";

export const BASE_URL = "/upload";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fileUpload: builder.mutation<FileUploadApiResponse, FileUploadApiRequest>({
      query: (config) => ({
        url: BASE_URL,
        method: "POST",
        ...config,
        body: objectToFormData(config?.body),
      }),
    }),
  }),
});
