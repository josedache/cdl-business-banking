import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import currencyjs from "currency.js";
import { format } from "date-fns";
import { beneficiaryApi } from "apis/beneficiary";
import LoadingContent from "components/LoadingContent";

type TransferBulkUploadTransferSummaryProps = {
  batchNumber: string;
} & TransferBulkContentProps;

export default function TransferBulkUploadTransferSummary(
  props: TransferBulkUploadTransferSummaryProps
) {
  const { formik, batchNumber, stepper } = props;

  const getBatchSummaryQuery = beneficiaryApi.useGetBeneficiaryBatchQuery({
    path: {
      batchNumber,
    },
  });

  const batchSummary = getBatchSummaryQuery?.data?.data || [];
  const totalAmount = batchSummary?.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  const transactionDetails = [
    {
      title: "Payout Date",
      value: format(new Date(), "PP"),
    },
    {
      title: "Total Amount",
      value: `${currencyjs(totalAmount || 0).format({
        symbol: "₦",
      })}`,
    },
    {
      title: "Send to",
      value: `${batchSummary?.length} Receipients`,
    },
    {
      title: "Transaction Fee",
      value: `${currencyjs(0).format({
        symbol: "₦",
      })}`,
    },
  ];

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

      <form onSubmit={formik.handleSubmit}>
        <div className="px-6 pt-4 pb-8">
          <Typography variant="h5" className="">
            Transfer summary
          </Typography>
          <Typography className=" text-neutral-500">
            Kindly review the details before proceeding. Please note that
            successful transfers cannot be reversed.
          </Typography>
          <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
            <Typography
              variant="body2"
              className="uppercase font-medium text-neutral-900"
            >
              Transaction Details
            </Typography>

            <LoadingContent
              loading={getBatchSummaryQuery?.isLoading}
              error={getBatchSummaryQuery?.isError}
              onRetry={getBatchSummaryQuery?.refetch}
            >
              <div className="mt-3">
                {transactionDetails.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 justify-between items-center mt-4"
                  >
                    <Typography variant="body2" className="text-neutral-500">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      {item.value}
                    </Typography>
                  </div>
                ))}
              </div>
            </LoadingContent>
          </div>
        </div>
        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting || getBatchSummaryQuery.isLoading}
            loadingPosition="end"
            endIcon={<></>}
          >
            Pay
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
