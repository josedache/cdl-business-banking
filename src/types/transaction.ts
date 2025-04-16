export type TransactionLimit = {
  id: number;
  tier: number;
  cumulative_daily_limit: string;
  single_transaction_limit: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: number;
  clientId: number;
  title: string;
  type: string;
  transaction_type: string;
  transaction_type_id: number;
  amount: string;
  transaction_status: string;
  beneficiary_bank: string;
  beneficiary_account_number: string;
  beneficiary_account_name: string;
  sender_bank: string;
  transaction_category: string;
  session_id: string;
  reference_number: string;
  transaction_date: string;
  transaction_time: string;
  source_account_name: string;
  mobile_label: string;
  note: string;
};

export type TransactionReceipt = {
  pdf: string;
  jpeg: string;
};
