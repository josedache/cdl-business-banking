import {
  ButtonBase,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import BorderLinearProgress from "components/BorderLinearProgress";

type TransferBulkUploadProgressProps = {} & TransferBulkContentProps;

export default function TransferBulkUploadProgress(
  props: TransferBulkUploadProgressProps
) {
  const { formik, stepper } = props;

  return (
    <Paper elevation={0} className="mx-auto max-w-[768px]">
      <div className="p-6">
        <ButtonBase
          disableRipple
          className="flex items-center gap-2"
          onClick={() => stepper.previous()}
        >
          <Icon icon="weui:back-filled" fontSize={20} />
          <Typography>Go back</Typography>
        </ButtonBase>
      </div>

      <Divider />
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4 p-6 min-h-[440px]">
          <div>
            <div>
              <Typography variant="h4" className="font-semibold">
                Upload CSV of Recipients
              </Typography>
            </div>

            <div className="p-4 mt-8 border-dashed border font-medium rounded-lg border-neutral-300">
              <div className="flex gap-2 items-center">
                <CircularProgress color="inherit" size={10} />
                <Typography className="font-light">
                  Verifying information
                </Typography>
              </div>
              <div className="flex gap-1 items-center w-full">
                <BorderLinearProgress
                  value={20}
                  className="w-full"
                  variant="determinate"
                  color="inherit"
                />
                <Typography className="font-light">50%</Typography>
              </div>
            </div>
          </div>

          <div className="bg-[#F3FBF8] py-[10px] px-4 flex items-center gap-4 rounded-md">
            <Icon
              icon="carbon:checkmark-outline"
              width="20"
              height="20"
              className="text-[#12B76A]"
            />
            <Typography className="flex-1">132 Recepients matched</Typography>
            <Divider orientation="vertical" flexItem />{" "}
            <CircularProgress color="inherit" size={12} />
          </div>

          <div className="bg-[#FFFBF5] py-[10px] px-4 flex items-center gap-4 rounded-md">
            <Icon
              icon="hugeicons:alert-02"
              width="20"
              height="20"
              className="text-[#F79009]"
            />
            <Typography className="flex-1">132 Recepients matched</Typography>
            <Divider orientation="vertical" flexItem />{" "}
            <CircularProgress color="inherit" size={12} />
          </div>
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            Upload & Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
