import { ApiRequest, ApiResponse } from "./api";

export type TransactionLimit = {
  id: number;
  tier: number;
  cumulative_daily_limit: string;
  single_transaction_limit: string;
  created_at: string;
  updated_at: string;
};

export type GetTransactionApiResponse = ApiResponse<TransactionLimit[]>;

export type GetTransactionApiRequest = ApiRequest<
  void,
  {
    transactionId: string;
  },
>;

export type GetTransactionLimitApiResponse = ApiResponse<TransactionLimit[]>;

export type GetTransactionLimitApiRequest = ApiRequest<
  void,
  void,
  {
    tier: string;
  }
>;

export type GenerateTransactionReceiptApiResponse = ApiResponse<
  TransactionLimit[]
>;

export type GenerateTransactionReceiptApiRequest = ApiRequest<
  void,
  {
    transactionId: string;
  }
s>;
