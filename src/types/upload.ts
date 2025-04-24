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
