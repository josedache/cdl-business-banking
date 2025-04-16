import { ApiRequest, ApiResponse } from "./api";

export type GetBeneficiariesApiResponse = ApiResponse<{
  beneficiaries: Array<{
    id: number;
    user_id: number;
    client_id: string;
    bank_code: string;
    bank_name: string;
    bank_icon: string;
    account_number: string;
    account_name: string;
    nip_account_name: string | null;
    nickname: string | null;
    amount: number | null;
    batch: string | null;
    batch_name: string | null;
    type: "transfer";
    nameEnquiryReference: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
  meta: {
    total: number;
    skipped: number;
    limit: string;
    page: string;
    pages: number;
  };
}>;

export type GetBeneficiariesApiRequest = ApiRequest<
  void,
  void,
  {
    type: "transfer";
    userId?: string;
    clientId?: string;
    accountNumber?: string;
    accountName?: string;
    bankCode?: string;
    bankName?: string;
    nickName?: string;
    batch?: string;
    batchName?: string;
    page?: string;
    limit?: string;
  }
>;

export type GetBeneficiaryApiResponse = ApiResponse<{
  id: number;
  user_id: number;
  client_id: string;
  bank_code: string;
  bank_name: string;
  bank_icon: string;
  account_number: string;
  account_name: string;
  nip_account_name: string | null;
  nickname: string | null;
  amount: number | null;
  batch: string | null;
  batch_name: string | null;
  type: "transfer";
  nameEnquiryReference: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}>;

export type GetBeneficiaryApiRequest = ApiRequest<
  void,
  {
    beneficiaryId: string;
  }
>;

export type BeneficiaryTemplateSample = {
  bankName: string;
  bankCode: number;
  accountNumber: string;
  accountName: string;
  amount: number;
};

export type GetBeneficiariesTemplateSampleResponse = ApiResponse<
  BeneficiaryTemplateSample[]
>;
export type GetBeneficiariesTemplateSampleRequest = ApiRequest;

export type DownloadBeneficiariesTemplateSampleResponse = ApiResponse<{
  file: string;
  downloadUrl: {
    file: string;
    downloadUrl: string;
  };
}>;
export type DownloadBeneficiariesTemplateSampleRequest = ApiRequest;

export type ProcessBeneficiaryBatchApiResponse = ApiResponse;
export type ProcessBeneficiaryBatchApiRequest = ApiRequest<
  void,
  {
    batchNumber: string;
  }
>;

export type UpdateBeneficiaryBatchApiResponse = ApiResponse<{}>;
export type UpdateBeneficiaryBatchApiRequest = ApiRequest<
  {
    batchName: string;
  },
  {
    batchNumber: string;
  }
>;

export type GetBeneficiaryBatchesApiResponse = ApiResponse<
  Array<{
    beneficiary_batch: string | null;
    beneficiary_batch_name: string | null;
    beneficiary_count: string;
    beneficiary_sample: string[];
  }>
>;

export type GetBeneficiaryBatchesApiRequest = ApiRequest;

export type GetBeneficiaryBatchApiResponse = ApiResponse<
  Array<{
    id: number;
    user_id: number;
    client_id: string;
    bank_code: string;
    bank_name: string;
    bank_icon: string;
    account_number: string;
    account_name: string;
    nip_account_name: string | null;
    nickname: string | null;
    amount: string;
    batch: string;
    batch_name: string;
    type: "transfer";
    nameEnquiryReference: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>
>;
export type GetBeneficiaryBatchApiRequest = ApiRequest<
  void,
  {
    batchNumber: string;
  }
>;

export type BeneficiaryBatchReport = {
  _id: string;
  userId: number;
  clientId: string;
  batch: string;
  bankName: string | null;
  bankCode: string | null;
  accountNumber: string | null;
  accountName: string | null;
  resolvedAccountName: string | null;
  accountNameMatchScore: number | null;
  nameEnquiryReference: string | null;
  amount: number | null;
  shouldProcess: boolean;
  isProcessed: boolean;
  isSuccess?: boolean;
  canEdit: boolean;
  message: string;
  responseType: "success" | "error" | "warning";
  response?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    referenceNumber: string;
  };
  uploadedFile: string;
  createdAt: string;
};
export type GetBeneficiaryBatchReportApiResponse = ApiResponse<{
  beneficiaries: Array<BeneficiaryBatchReport>;
  duplicates: Array<BeneficiaryBatchReport>;
  meta: {
    total: number;
    processed: number;
    notProcessed: number;
    success: number;
    error: number;
    warning: number;
    duplicates: number;
  };
}>;
export type GetBeneficiaryBatchReportApiRequest = ApiRequest<
  void,
  {
    batchNumber: string;
  }
>;

export type GetBeneficiaryBatchSummaryApiResponse = ApiResponse<{}>;
export type GetBeneficiaryBatchSummaryApiRequest = ApiRequest<
  void,
  {
    batchNumber: string;
  }
>;

export type CreateBeneficiaryApiResponse = ApiResponse<{}>;
export type CreateBeneficiaryApiRequest = {
  body: Partial<{
    type: "transfer";
    nameEnquiryReference: string;
    nickName: string;
    isNewBatch: boolean;
    batchNumber: string;
    batchName: string;
    batchRecordId: string;
    amount: number;
    checkForExistence: boolean;
  }>;
};

export type UpdateBeneficiaryApiResponse = ApiResponse<{}>;
export type UpdateBeneficiaryApiRequest = ApiRequest<
  {
    nameEnquiryReference: string;
    nickName?: string;
  },
  {
    beneficiaryId: string;
  }
>;
