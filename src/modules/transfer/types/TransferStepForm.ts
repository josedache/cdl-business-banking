import { FormikProps } from "formik";

export type TransferSetupFormikValues = {
  accountName: string;
  accountNumber: string;
  amount: string;

  transactionPin: string;
};
export type TransferContentProps = {
  formik: FormikProps<TransferSetupFormikValues>;
  stepper: any;
};
