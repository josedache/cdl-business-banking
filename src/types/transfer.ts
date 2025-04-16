import { ApiRequest, ApiResponse } from "./api";

export type TransferApiRequest = ApiRequest<{
  walletId: number;
  amount: number;
  nameEnquiryReference: string;
  narration?: string;
  transactionPin: string;
}>;

export type TransferApiResponse = ApiResponse<{
  transfer: {
    userId: number;
    transferType: "intrabank" | string;
    applicationChannel: "mobile" | string;
    reference: string;
    amount: number;
    fees: string;
    sourceClientId: number;
    sourceClientType: string;
    sourceSavingsId: number;
    sourceBankCode: string;
    sourceAccountNumber: string;
    sourceAccountName: string;
    sourcePhoneNumber: string;
    sourceKYCLevel: string;
    beneficiaryClientId: number;
    beneficiarySavingsId: number;
    beneficiaryBankCode: string;
    beneficiaryAccountNumber: string;
    beneficiaryAccountName: string;
    beneficiaryBankVerificationNumber: string;
    beneficiaryKYCLevel: number;
    nameEnquiryReference: string;
    narration: string;
    beneficiaryBatch: unknown | null;
    transferBatch: unknown | null;
    beneficiaryPhoneNumber: string | null;
    resourceId: unknown | null;
    service_response: unknown | null;
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  phone: string;
}>;

export type TransferBulkApiRequest = ApiRequest<{
  walletId?: number;
  beneficiaryBatchNumber: string;
  narration?: string;
}>;
export type TransferBulkApiResponse = ApiResponse<{
  transferBatchNumber: string;
  phone: string;
  meta: {
    count: number;
    total: number;
  };
}>;

export type BulkTransferOtpVerificationApiRequest = ApiRequest<
  { otp: string },
  { batchNumber: string }
>;
export type BulkTransferOtpVerificationApiResponse = ApiResponse<{}>;

export type BulkTransferTransactionVerificationApiRequest = ApiRequest<
  { transactionPin: string },
  { batchNumber: string }
>;
export type BulkTransferTransactionVerificationApiResponse = ApiResponse<{}>;

export type CompleteTransferApiRequest = ApiRequest<
  {
    shouldAddBeneficiary: boolean;
    otp: string;
  },
  { reference: string }
>;

export type CompleteTransferApiResponse = ApiResponse<{
  isSuccessful: boolean;
  message: string;
  reference: string;
  statusCode: string;
  totalAmount: string;
  beneficiaryAccountNumber: string;
  beneficiaryName: string;
  timeCreated: string;
  bankName: string;
}>;

export type GetTransferWalletsApiRequest = ApiRequest;
export type GetTransferWalletsApiResponse = ApiResponse<
  {
    walletId: number;
    businessId: number;
    name: string;
    clientId: number;
    groupId: number;
    isActive: boolean;
    isValidated: boolean;
    businessType: string;
    balance: number;
  }[]
>;
