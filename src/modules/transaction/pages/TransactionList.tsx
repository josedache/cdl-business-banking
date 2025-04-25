import { useState } from "react";
import { Paper, Tab, Tabs, Typography } from "@mui/material";
import TransactionListFeature from "modules/transaction/features/TransactionList.tsx";

function TransactionList() {
  const [activeTab, setActiveTab] = useState(0);

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
                { label: "Transfers", value: 1 },
                // {
                //   label: "Airtime & Data",
                //   value: 2,
                // },
                // { label: "Savings", value: 3 },
              ].map((tab, index) => (
                <Tab key={index} {...tab} value={index} />
              ))}
            </Tabs>
          </div>
        </div>

        <TransactionListFeature />
      </Paper>
    </>
  );
}

export const Component = TransactionList;

export default TransactionList;
