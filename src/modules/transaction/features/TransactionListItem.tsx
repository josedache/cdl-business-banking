import { Transaction } from "types/transaction.ts";
import { IconButton, Typography } from "@mui/material";
import { Icon as Iconify } from "@iconify/react";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { cn } from "utils/cn.ts";
import CurrencyTypography from "components/CurrencyTypography.tsx";
import * as dfns from "date-fns";

function TransactionListItem(props: {
  transaction: Transaction;
  divider?: boolean;
}) {
  const { transaction, divider } = props;

  const isDebit = ![TransactionType.deposit, TransactionType.interest].includes(
    transaction?.transaction_type_id
  );

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-4 py-4",
          divider && "border-t border-gray-100"
        )}
      >
        <IconButton
          variant="soft"
          color={
            {
              [TransactionType.withdrawal]: "error",
              [TransactionType.deposit]: "success",
              [TransactionType.card]: "error",
              [TransactionType.airtime]: "error",
              [TransactionType.cable]: "error",
              [TransactionType.electricity]: "error",
              [TransactionType.overdraft]: "success",
              [TransactionType.feeDeduction]: "error",
              [TransactionType.yield]: "error",
              [TransactionType.interest]: "success",
              [TransactionType.other]: "error",
            }[transaction?.transaction_type] as any
          }
        >
          <Iconify
            icon={
              ({
                // [TransactionType.withdrawal]: "uis:arrow-up-right",
                [TransactionType.withdrawal]: "ic:baseline-minus",
                // [TransactionType.deposit]: "uis:arrow-down-left",
                [TransactionType.deposit]: "ic:twotone-plus",
                [TransactionType.card]: "famicons:card-outline",
                [TransactionType.airtime]: "fluent:phone-24-regular",
                [TransactionType.cable]: "streamline:satellite-dish",
                [TransactionType.electricity]: "mage:electricity",
                // [TransactionType.overdraft]: "uis:arrow-down-left",
                [TransactionType.overdraft]: "ic:twotone-plus",
                // [TransactionType.feeDeduction]: "uis:arrow-up-right",
                [TransactionType.feeDeduction]: "ic:baseline-minus",
                [TransactionType.yield]: "uis:arrow-up-right",
                // [TransactionType.interest]: "uis:arrow-down-left",
                [TransactionType.interest]: "ic:sharp-percent",
                // [TransactionType.other]: "famicons:card-outline",
                [TransactionType.other]: "ic:sharp-percent",
              }[transaction?.transaction_type] as any) ??
              "icon-park-outline:transaction-order"
            }
          />
        </IconButton>
        <div>
          <Typography variant="body1" className="space-x-1" gutterBottom>
            {transaction?.mobile_label
              ?.split(" ")
              .filter((w) => !!w)
              ?.map((word) => {
                const newWord = word.toLowerCase();
                return (
                  <span
                    className={cn(
                      "capitalize inline-block",
                      newWord === "to" || newWord === "from" ? "" : ""
                    )}
                  >
                    {newWord}
                  </span>
                );
              }) || "----"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dfns.format(
              new Date(transaction?.transaction_time),
              "MMM d, yyyy"
            )}
            {" at "}
            {dfns.format(new Date(transaction?.transaction_time), "hh:mmaa")}
          </Typography>
        </div>
        <div className="flex-1" />
        <Typography
          className={cn(isDebit ? "text-error-main" : "text-success-main")}
        >
          {isDebit ? "-" : "+"}
          <CurrencyTypography component="span">
            {transaction?.amount}
          </CurrencyTypography>
        </Typography>
      </div>
    </>
  );
}

export default TransactionListItem;
