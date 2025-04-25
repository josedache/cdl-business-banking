import { Icon } from "@iconify/react/dist/iconify.js";
import { ButtonBase, Paper, Skeleton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import currencyjs from "currency.js";

import { transactionApi } from "apis/transaction";
import { transferApi } from "apis/transfer";
import LoadingContent from "components/LoadingContent";
import { TRANSACTION } from "constants/urls";
import { walletApi } from "apis/wallet";
import { BANK_DEFAULT_ICON } from "constants/global";
import clsx from "clsx";

export type TransferRecentTransactionsProps = {
  transactionType: "transfer" | "bulk_transfer";
};

export default function TransferRecentTransactions(
  props: TransferRecentTransactionsProps
) {
  const { transactionType } = props;
  const transferWalletsQueryResult = walletApi.useGetWalletsQuery({});
  const transferWallets = transferWalletsQueryResult.data?.data;

  const navigate = useNavigate();

  const mainWallet = transferWallets?.find((wallet) => !!wallet?.groupId);

  const getSingleTransaction =
    transactionApi.useGetTransactionSavingsHistoryQuery(
      {
        path: { savingsAccountId: mainWallet?.id },
        params: {
          page: 1,
          limit: 5,
        },
      },
      { skip: !mainWallet?.id || transactionType !== "transfer" }
    );

  const getBulkTransactionsQuery = transferApi.useGetTransferBulkSummariesQuery(
    {
      params: {
        page: 1,
        limit: 5,
      },
    },
    { skip: transactionType === "bulk_transfer" }
  );

  return (
    <Paper elevation={0} className="rounded-2xl p-6 w-full">
      <div className="flex justify-between items-center">
        <Typography className="text-neutral-600">
          Recent Transactions
        </Typography>

        <ButtonBase
          onClick={() => navigate(TRANSACTION)}
          className="text-primary-main font-medium"
        >
          See All
        </ButtonBase>
      </div>

      {transactionType === "transfer" && (
        <LoadingContent
          loading={
            getSingleTransaction.isLoading ||
            transferWalletsQueryResult?.isLoading
          }
          error={getSingleTransaction?.isError}
          // onRetry={getSingleTransaction.refetch}
          // onEmptied={() => <TransferRecentTransactionEmpty />}
          renderLoading={() => <TransferRecentTransactionSkeleton />}
        >
          {getSingleTransaction?.data?.data?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 pt-[18px]">
              <img
                src={item.icon || BANK_DEFAULT_ICON}
                alt="user"
                className={clsx(
                  "w-[40px] h-[40px] rounded-full bg-neutral-300",
                  item.icon && "bg-transparent"
                )}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = BANK_DEFAULT_ICON;
                }}
              />
              <div className="flex flex-col">
                <Typography
                  variant="body2"
                  className="font-medium text-neutral-900 capitalize"
                >
                  {item.beneficiary_account_name
                    ?.split(" ")
                    ?.map((name) => name.toLocaleLowerCase())
                    .join(" ")}
                </Typography>
                <Typography variant="body2" className="text-neutral-500">
                  {item.beneficiary_account_number} {item.beneficiary_bank}
                </Typography>
              </div>

              <Typography className="ml-auto font-medium">
                <span className="text-[#9A9CA0] pr-1">₦</span>
                {currencyjs(item.amount || 0).format({
                  symbol: "",
                })}
              </Typography>
            </div>
          ))}
        </LoadingContent>
      )}

      {transactionType === "bulk_transfer" && (
        <LoadingContent
          loading={getBulkTransactionsQuery.isLoading}
          error={getBulkTransactionsQuery?.isError}
          // onRetry={getBulkTransactionsQuery.refetch}
          // onEmptied={() => <TransferRecentTransactionEmpty />}
          renderLoading={() => <TransferRecentTransactionSkeleton />}
        >
          {getBulkTransactionsQuery?.data?.data?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 pt-[18px]">
              <Paper
                elevation={0}
                className="rounded-full flex w-10 h-10 justify-center items-center  bg-[#F4F5F5]"
              >
                <Icon icon="hugeicons:user-group-03" width="20" height="20" />
              </Paper>
              <div className="flex flex-col gap-1">
                <Typography
                  variant="body2"
                  className="font-medium text-neutral-900"
                >
                  Bulk payment to {item.beneficiaryBatchName}
                </Typography>
                <Typography variant="body2" className="text-neutral-500">
                  Total Transfers {item.totalTransfers}
                </Typography>
              </div>

              <Typography className="ml-auto font-medium">
                <span className="text-[#9A9CA0] pr-1">₦</span>
                {currencyjs(item.totalAmount || 0).format({
                  symbol: "",
                })}
              </Typography>
            </div>
          ))}
        </LoadingContent>
      )}
    </Paper>
  );
}

function TransferRecentTransactionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 pt-[18px] w-full">
      {Array(5)
        .fill(5)
        .map(() => (
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex flex-col flex-1 w-full gap-1">
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={100} height={20} />
            </div>
            <Skeleton variant="text" width={100} height={20} />
          </div>
        ))}
    </div>
  );
}

// function TransferRecentTransactionEmpty() {
//   return (
//     <div className="flex justify-center items-center h-full">
//       <Typography className="text-neutral-500">No transactions</Typography>
//     </div>
//   );
// }
