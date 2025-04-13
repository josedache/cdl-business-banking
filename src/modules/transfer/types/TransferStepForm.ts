import { FormikProps } from "formik";

export type TransferSetupFormikValues = {
  accountName: string;
  accountNumber: string;
  bankSortCode: string;
  amount: string;

  walletId: string;
  nameEnquiryReference: string;
  narration: string;
  transactionPin: string;
  reference: string;

  shouldAddBeneficiary: boolean;
  otp: string;
};
export type TransferContentProps = {
  formik: FormikProps<TransferSetupFormikValues>;
  stepper: any;
};
