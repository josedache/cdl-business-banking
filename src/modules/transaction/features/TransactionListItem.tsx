import { Transaction } from "types/transaction.ts";
import { Typography } from "@mui/material";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { cn } from "utils/cn.ts";
import CurrencyTypography from "components/CurrencyTypography.tsx";
import * as dfns from "date-fns";
import TransactionDetails from "modules/transaction/features/TransactionDetails.tsx";
import TransactionIcon from "modules/transaction/features/TransactionIcon.tsx";

function TransactionListItem(props: {
  transaction: Transaction;
  divider?: boolean;
}) {
  const { transaction, divider } = props;

  const isDebit = [TransactionType.deposit, TransactionType.interest].includes(
    transaction?.transaction_type_id
  );

  return (
    <TransactionDetails id={transaction.id}>
      {({ toggleOpen }) => (
        <>
          <div
            className={cn(
              "flex items-center gap-4 py-4 cursor-pointer",
              divider && "border-t border-gray-100"
            )}
            onClick={toggleOpen}
          >
            <TransactionIcon transaction={transaction} />
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
                {dfns.format(
                  new Date(transaction?.transaction_time),
                  "hh:mmaa"
                )}
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
      )}
    </TransactionDetails>
  );
}

export default TransactionListItem;
