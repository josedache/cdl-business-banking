import { Button, Card, Paper, Skeleton, Typography } from "@mui/material";
import CheckMark from "assets/imgs/check.png";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";
import { transactionApi } from "apis/transaction";
import CurrencyTypography from "components/CurrencyTypography";

type DashboardAccountSetupPinSetupCompletedProps =
  {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupPinSetupCompleted(
  props: DashboardAccountSetupPinSetupCompletedProps
) {
  const { formik } = props;

  const getTransactionLimitQuery = transactionApi.useGetTransactionLimitQuery({
    params: {
      tier: String(1),
    },
  });

  return (
    <Paper elevation={0} className="mx-auto max-w-[600px] p-6">
      <div>
        <div className="flex justify-center">
          <img
            alt="checkmark"
            src={CheckMark}
            className="w-full h-full max-w-[80px]"
          />
        </div>

        <Typography variant="h5" className="text-center font-semibold mt-8">
          Your account is ready{" "}
        </Typography>
        <Typography className="text-center mt-1">
          You can start to transact with your account{" "}
        </Typography>

        <div className="flex justify-center">
          <Button variant="soft" className="mt-8 font-semibold">
            Fund Your Account
          </Button>
        </div>

        <Card
          elevation={0}
          className="mt-8 p-4 text-white space-y-4 rounded-[12px]"
          sx={{
            background: `linear-gradient(112deg, #353D4A 40.01%, #737882 92.86%), #F6F8FB;`,
          }}
        >
          <Typography variant="h5">Current Limits</Typography>
          {[
            {
              title: "Transfer limit",
              amount:
                getTransactionLimitQuery?.data?.data?.[0]
                  ?.single_transaction_limit,
            },
            {
              title: "Cumulative daily limit",
              amount:
                getTransactionLimitQuery?.data?.data?.[0]
                  ?.cumulative_daily_limit,
            },
          ].map(({ title, amount }) => (
            <div key={title} className="flex justify-between items-center py-2">
              <Typography className="font-medium">{title}</Typography>

              {getTransactionLimitQuery.isLoading ? (
                <Skeleton variant="text" width={100} height={20} />
              ) : (
                <CurrencyTypography className="font-medium">
                  {amount}
                </CurrencyTypography>
              )}
            </div>
          ))}
        </Card>

        <Button
          onClick={() => {
            formik.handleSubmit();
          }}
          size="large"
          fullWidth
          className="mt-15"
        >
          Done
        </Button>
      </div>
    </Paper>
  );
}
