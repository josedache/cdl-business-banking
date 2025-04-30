import {
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";
import { transactionApi } from "apis/transaction";
import CurrencyTypography from "components/CurrencyTypography";
import { Icon } from "@iconify/react/dist/iconify.js";
import { walletApi } from "apis/wallet";
import useClipboard from "hooks/use-clipboard";

type DashboardAccountSetupPinSetupCompletedProps =
  {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupPinSetupCompleted(
  props: DashboardAccountSetupPinSetupCompletedProps
) {
  const { formik } = props;
  const { writeText } = useClipboard();

  const getTransactionLimitQuery = transactionApi.useGetTransactionLimitQuery({
    params: {
      tier: String(1),
    },
  });

  const transferWalletsQueryResult = walletApi.useGetWalletsQuery({});
  const transferWallets = transferWalletsQueryResult.data?.data;

  const mainWallet = transferWallets?.find((wallet) => !!wallet?.groupId);

  return (
    <Paper elevation={0} className="mx-auto max-w-[520px] ">
      <div className="p-6">
        <div className="flex justify-center mt-5">
          <div className="bg-[#12B76A] border-6 border-[#DBF4E9] w-20 h-20 rounded-full flex items-center justify-center">
            <Icon
              icon="charm:tick"
              width="45"
              stroke="100"
              height="45"
              className="text-white"
            />
          </div>
        </div>

        <Typography
          variant="h5"
          className="text-center font-semibold mt-8 text-neutral-500s"
        >
          Your account is ready{" "}
        </Typography>
        <Typography className="text-center mt-1 text-[#686A71">
          You can start to transact with your account{" "}
        </Typography>

        <div className="mt-8">
          <Typography className="text-center mt-1">
            Fund your Credit Direct account
          </Typography>
          <Paper
            className="flex items-center gap-2 p-[8px] rounded-lg bg-[#F8F9FB] border border-[#EDEFF2] w-fit mx-auto mt-1"
            elevation={0}
          >
            <IconButton
              disabled={
                transferWalletsQueryResult?.isLoading ||
                !mainWallet?.accountNumber
              }
              onClick={() => writeText(mainWallet?.accountNumber || "")}
              className="p-0"
            >
              <Icon icon="hugeicons:copy-01" width="18" height="18" />
            </IconButton>
            {transferWalletsQueryResult?.isLoading ? (
              <Skeleton variant="text" width="100px" height="24px" />
            ) : (
              <Typography>{mainWallet?.accountNumber}</Typography>
            )}
          </Paper>
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
                getTransactionLimitQuery?.data?.data?.single_transaction_limit,
            },
            {
              title: "Cumulative daily limit",
              amount:
                getTransactionLimitQuery?.data?.data?.cumulative_daily_limit,
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
      </div>

      <Divider className="mt-6" />

      <div className="py-5 px-5">
        <Button
          onClick={() => {
            formik.handleSubmit();
          }}
          size="large"
          fullWidth
        >
          Done
        </Button>
      </div>
    </Paper>
  );
}
