import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import currencyjs from "currency.js";

import { TransferContentProps } from "../types/TransferStepForm";
import { lookupApi } from "apis/lookup";

type TransferSingleConfirmNewTransferProps = {} & TransferContentProps;

export default function TransferSingleConfirmNewTransfer(
  props: TransferSingleConfirmNewTransferProps
) {
  const { formik, stepper } = props;

  const getALlBanksQuery = lookupApi.useBankLookupQuery({
    params: {
      activeOnly: true,
    },
  });
  const options = getALlBanksQuery?.data?.data || [];
  const bankName =
    options.find(
      (option) => option.bank_sort_code === formik.values.bankSortCode
    )?.name || "";

  const transactionDetails = [
    {
      title: "Name",
      value: formik.values.accountName?.toUpperCase(),
    },
    {
      title: "Account No.",
      value: formik.values.accountNumber,
    },
    {
      title: "Bank",
      value: bankName || "",
    },
    {
      title: "Amount",
      value: `${currencyjs(formik.values.amount || 0).format({
        symbol: "₦",
      })}`,
    },
    {
      title: "Transfer Fee",
      value: `${currencyjs(0).format({ symbol: "₦" })}`,
    },
  ];

  return (
    <Paper elevation={0} className="mx-auto max-w-[520px]">
      <form onSubmit={formik.handleSubmit}>
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
        <div className="px-6 pt-4 pb-8">
          <Typography variant="h5" className="">
            Confirm New Transfer
          </Typography>
          <Typography className=" text-neutral-500">
            Kindly review the details before proceeding. Please note that
            successful transfers cannot be reversed
          </Typography>
          <div className="mt-4 p-4 bg-neutral-50">
            <Typography
              variant="body2"
              className="uppercase font-medium text-neutral-900"
            >
              Transaction Details
            </Typography>

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
          </div>
        </div>
        <Divider className="mt-8" />
        <div className="px-4 py-4 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
