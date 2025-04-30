import { ApiRequest, ApiResponse } from "./api";

export type FileUploadApiRequest = ApiRequest<{
  file: string | File | Blob;
  uploadType: "bank_beneficiary" | "id_card" | "nin" | "utility_bill";
}>;

export type FileUploadApiResponse = ApiResponse<{
  isSuccessful: boolean;
  uploadResponse: {
    batchNumber: string;
  };
}>;

export type MemorandumUploadApiRequest = ApiRequest<{
  file: string | File | Blob;
  uploadFileType: string;
  description: string;
  rcNumber: string;
}>;
export type MemorandumUploadApiResponse = ApiResponse<{
  isSuccessful: boolean;
}>;
