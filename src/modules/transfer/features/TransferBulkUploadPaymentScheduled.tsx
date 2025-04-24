import { Divider, Paper, Typography } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";

type TransferBulkUploadPaymentScheduledProps = {} & TransferBulkContentProps;

export default function TransferBulkUploadPaymentScheduled(
  props: TransferBulkUploadPaymentScheduledProps
) {
  const { formik } = props;

  return (
    <Paper elevation={0} className="mx-auto max-w-[768px]">
      <form onSubmit={formik.handleSubmit}>
        <div className="px-6 py-20 flex flex-col justify-center items-center">
          <div className="bg-[#12B76A] border-6 border-[#DBF4E9] w-20 h-20 rounded-full flex items-center justify-center">
            <Icon
              icon="charm:tick"
              width="45"
              stroke="100"
              height="45"
              className="text-white"
            />
          </div>
          <Typography variant="h5" className="max-w-[250px] text-center mt-8">
            You payment has been submitted successfully{" "}
          </Typography>
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-center">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
          >
            Go back to Dashboard
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
