import { ButtonBase, Paper, Typography } from "@mui/material";
import { transactionApi } from "apis/transaction";
import { transferApi } from "apis/transfer";
import CurrencyTypography from "components/CurrencyTypography";

export default function TransferRecentTransactions() {
  const transferWalletsQueryResult =
    transferApi.useGetTransferWalletsQuery(undefined);
  const transferWallets = transferWalletsQueryResult.data?.data;

  const mainWallet = transferWallets?.find(
    (wallet) => wallet.businessType === "Group"
  );

  const getSingleTransaction =
    transactionApi.useGetTransactionSavingsHistoryQuery(
      {
        path: { savingsAccountId: mainWallet?.walletId },
        params: {
          page: 1,
          limit: 5,
        },
      },
      { skip: !mainWallet?.walletId }
    );
  return (
    <Paper elevation={0} className="mx-auto rounded-2xl max-w-[520px] p-6 ">
      <div className="flex justify-between items-center">
        <Typography className="text-netral-600">Recent Transactions</Typography>

        <ButtonBase className="text-primary-main font-medium">
          See All
        </ButtonBase>
      </div>

      <div>
        {getSingleTransaction?.data?.data?.map((item, index) => (
          <div key={index} className="flex items-center gap-4 pt-[18px]">
            <img
              src={""}
              alt="user"
              className="w-[40px] h-[40px] rounded-full"
            />
            <div className="flex flex-col gap-1">
              <Typography className="font-medium text-neutral-900">
                {item.beneficiary_account_name}
              </Typography>
              <Typography className="text-neutral-500">
                {item.beneficiary_account_number}{" "}
                {item.beneficiary_account_name}
              </Typography>
            </div>
            <CurrencyTypography className="font-medium text-neutral-900 ml-auto">
              {item.amount}
            </CurrencyTypography>
          </div>
        ))}
      </div>
    </Paper>
  );
}
