import { FormikProps } from "formik";

export type TransferBulkFormikValues = {
  file: string;
  transactionPin: string;
  name: string;
  otp: string;
  confirmList: boolean;
};

export type TransferBulkContentProps = {
  formik: FormikProps<TransferBulkFormikValues>;
  stepper: any;
};
