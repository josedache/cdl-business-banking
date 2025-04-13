import { FormikProps } from "formik";

export type TransferBulkFormikValues = {
  file: string;
};

export type TransferBulkContentProps = {
  formik: FormikProps<TransferBulkFormikValues>;
  stepper: any;
};
