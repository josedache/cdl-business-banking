import { ApiRequest, ApiResponse } from "./api";
import {
  Transaction,
  TransactionLimit,
  TransactionReceipt,
} from "types/transaction.ts";

export type GetTransactionSavingsHistoryApiResponse = ApiResponse<
  Transaction[]
>;

export type GetTransactionSavingsHistoryApiRequest = ApiRequest<
  void,
  {
    savingsAccountId: number | string;
  },
  {
    page?: number | string;
    limit?: number | string;
    accountNumber?: number | string;
  }
>;

export type GetTransactionApiResponse = ApiResponse<Transaction>;

export type GetTransactionApiRequest = ApiRequest<
  void,
  {
    id: string | number;
  },
  {
    tier: string;
  }
>;

export type GetTransactionLimitApiResponse = ApiResponse<TransactionLimit>;

export type GetTransactionLimitApiRequest = ApiRequest<
  void,
  void,
  {
    tier?: string;
  }
>;

export type GenerateTransactionReceiptApiResponse =
  ApiResponse<TransactionReceipt>;

export type GenerateTransactionReceiptApiRequest = ApiRequest<
  void,
  {
    id: string;
  }
>;
