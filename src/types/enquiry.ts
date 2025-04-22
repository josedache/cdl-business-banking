import { ApiRequest, ApiResponse } from "./api";

export type NameEnquiryApiRequest = ApiRequest<{
  bankCode: string;
  accountNumber: string;
}>;

export type NameEnquiryApiResponse = ApiResponse<{
  responseCode: string;
  message: string;
  responseContent: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    referenceNumber: string;
  };
}>;
