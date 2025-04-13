import { ApiRequest, ApiResponse } from "./api";

export type GetBeneficiaryApiResponse = ApiResponse<Array<any>>;

export type GetBeneficiaryApiRequest = ApiRequest<
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
