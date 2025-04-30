import { Avatar, IconButton } from "@mui/material";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { Icon as Iconify } from "@iconify/react";
import { Transaction } from "types/transaction.ts";

function TransactionIcon(props: TransactionIconProps) {
  const { transaction } = props;

  if (!transaction) {
    return (
      <IconButton disableRipple variant="soft" color="default">
        <Iconify icon="icon-park-outline:transaction-order" />
      </IconButton>
    );
  }

  if (transaction.icon) {
    return <Avatar src={transaction.icon} />;
  }

  const getTransactionType = (
    type: string | number
  ): TransactionType | undefined => {
    const typeNumber = typeof type === "string" ? parseInt(type, 10) : type;
    return Object.values(TransactionType).includes(typeNumber)
      ? typeNumber
      : undefined;
  };

  const getTransactionColor = (type?: TransactionType) => {
    if (!type) return "default";

    return (
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
      }[type] ?? "default"
    );
  };

  const getTransactionIcon = (type?: TransactionType) => {
    if (!type) return "icon-park-outline:transaction-order";

    return (
      {
        [TransactionType.withdrawal]: "ic:baseline-minus",
        [TransactionType.deposit]: "hugeicons:bank",
        [TransactionType.card]: "famicons:card-outline",
        [TransactionType.airtime]: "fluent:phone-24-regular",
        [TransactionType.cable]: "streamline:satellite-dish",
        [TransactionType.electricity]: "mage:electricity",
        [TransactionType.overdraft]: "hugeicons:bank",
        [TransactionType.feeDeduction]: "ic:baseline-minus",
        [TransactionType.yield]: "uis:arrow-up-right",
        [TransactionType.interest]: "ic:sharp-percent",
        [TransactionType.other]: "ic:sharp-percent",
      }[type] ?? "icon-park-outline:transaction-order"
    );
  };

  const transactionType = getTransactionType(transaction.transaction_type);

  return (
    <IconButton
      disableRipple
      variant="soft"
      color={getTransactionColor(transactionType)}
    >
      <Iconify icon={getTransactionIcon(transactionType)} />
    </IconButton>
  );
}

export default TransactionIcon;

export type TransactionIconProps = {
  transaction?: Transaction;
};
