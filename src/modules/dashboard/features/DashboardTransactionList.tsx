import { useMemo, useState } from "react";
import { Paper, Tab, Tabs, Typography } from "@mui/material";
import TransactionListFeature from "modules/transaction/features/TransactionList.tsx";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { TransactionFilterState } from "modules/transaction/features/TransactionFilter.tsx";

function DashboardTransactionList() {
  const [activeTab, setActiveTab] = useState(0);

  const filter = useMemo(
    () =>
      ({
        transactionType: activeTab ? String(activeTab) : undefined,
      }) as TransactionFilterState,
    [activeTab]
  );

  return (
    <>
      <Paper className="p-4 md:p-8 space-y-2" elevation={0}>
        <div className="space-y-2">
          <Typography variant="h5" className="">
            Transactions
          </Typography>
          <div className="border-b border-gray-100">
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
            >
              {[
                { label: "All", value: 0 },
                { label: "Received", value: TransactionType.deposit },
                {
                  label: "Sent",
                  value: TransactionType.withdrawal,
                },
              ].map((tab, index) => (
                <Tab key={index} {...tab} value={index} />
              ))}
            </Tabs>
          </div>
        </div>

        <TransactionListFeature hideFilter noPagination filter={filter} />
      </Paper>
    </>
  );
}

export const Component = DashboardTransactionList;

export default DashboardTransactionList;
