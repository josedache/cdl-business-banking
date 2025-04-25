import { Avatar, IconButton } from "@mui/material";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { Icon as Iconify } from "@iconify/react";
import { Transaction } from "types/transaction.ts";

function TransactionIcon(props: TransactionIconProps) {
  const { transaction } = props;

  if (transaction.icon) {
    return <Avatar src={transaction.icon} />;
  }

  return (
    <>
      <IconButton
        disableRipple
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
    </>
  );
}

export default TransactionIcon;

export type TransactionIconProps = {
  transaction: Transaction;
};
