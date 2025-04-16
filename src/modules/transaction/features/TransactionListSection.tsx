import { TransactionSection } from "modules/transaction/types/transaction.ts";
import * as dfns from "date-fns";
import { Typography } from "@mui/material";
import TransactionListItem from "./TransactionListItem";

function TransactionListSection(props: { section: TransactionSection }) {
  const { section } = props;
  const date = new Date(section.date);
  // const yearStart = dfns.startOfYear(new Date());

  return (
    <>
      <div className="space-y-1">
        <Typography variant="body1" className="uppercase text-gray-300">
          {/*{dfns.isBefore(date, yearStart)*/}
          {/*  ? dfns.format(date, "dd MMMM yyyy")*/}
          {/*  : dfns.format(date, "dd MMMM")}*/}
          {dfns.format(date, "MMMM yyyy")}
        </Typography>

        <div className="">
          {section.transactions?.map((transaction, index) => (
            <TransactionListItem
              key={transaction?.id}
              transaction={transaction}
              divider={!!index}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TransactionListSection;
