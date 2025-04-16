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
import { beneficiaryApi } from "apis/beneficiary";

type TransferBulkUploadProgressProps = {
  batchNumber: string;
} & TransferBulkContentProps;

export default function TransferBulkUploadProgress(
  props: TransferBulkUploadProgressProps
) {
  const { formik, batchNumber, stepper } = props;

  const getBatchReportQuery = beneficiaryApi.useGetBeneficiaryBatchReportQuery(
    {
      path: {
        batchNumber,
      },
    },
    {
      pollingInterval: 10000, //TODO: reduce polling time
    }
  );

  const total = getBatchReportQuery?.data?.data?.meta?.total || 0;
  const success = getBatchReportQuery?.data?.data?.meta?.processed || 0;
  const uploadPercentage = Number(total > 0 ? (success / total) * 100 : 0);

  const totalMatchedRecipientsCount =
    getBatchReportQuery?.data?.data?.beneficiaries?.filter(
      (beneficiary) => beneficiary.responseType === "success"
    )?.length || 0;

  const totalFailedRecipientsCount =
    getBatchReportQuery?.data?.data?.beneficiaries?.filter(
      (beneficiary) => beneficiary.responseType !== "success"
    )?.length || 0;

  const isLoading = uploadPercentage < 100;

  return (
    <Paper elevation={0} className="mx-auto max-w-[768px]">
      <div className="p-6">
        <ButtonBase
          disableRipple
          className="flex items-center gap-2"
          disabled
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
                {isLoading ? (
                  <CircularProgress color="inherit" size={10} />
                ) : null}
                <Typography className="font-light">
                  {isLoading
                    ? "Verifying information"
                    : "Verification complete"}
                </Typography>
              </div>
              <div className="flex gap-1 items-center w-full">
                <BorderLinearProgress
                  value={uploadPercentage}
                  className="w-full"
                  variant="determinate"
                  color="inherit"
                />
                <Typography className="font-light">
                  {uploadPercentage}%
                </Typography>
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
            <Typography className="flex-1">
              {totalMatchedRecipientsCount} Recipients matched
            </Typography>
            {isLoading ? (
              <>
                <Divider orientation="vertical" flexItem />{" "}
                <CircularProgress color="inherit" size={12} />
              </>
            ) : null}
          </div>

          <div className="bg-[#FFFBF5] py-[10px] px-4 flex items-center gap-4 rounded-md">
            <Icon
              icon="hugeicons:alert-02"
              width="20"
              height="20"
              className="text-[#F79009]"
            />
            <Typography className="flex-1">
              {totalFailedRecipientsCount} Errors detected
            </Typography>
            {isLoading ? (
              <>
                <Divider orientation="vertical" flexItem />{" "}
                <CircularProgress color="inherit" size={12} />
              </>
            ) : null}
          </div>
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={isLoading}
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            {isLoading ? "Uploading..." : "Continue"}
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
