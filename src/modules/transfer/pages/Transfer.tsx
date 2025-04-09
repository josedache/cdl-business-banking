import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import clsx from "clsx";
import CurrencyTypography from "components/CurrencyTypography";
import TransferBulkTab from "../features/TransferBulkTab";
import React from "react";

export default function Transfer() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };
  const tabs = [
    {
      title: "Single Transfer",
      content: <div>Single Transfer</div>,
    },
    {
      title: "Bulk Transfer",
      content: <div>Bulk Transfer</div>,
    },
  ];

  return (
    <div>
      <Paper className="mx-auto rounded-2xl max-w-[520px]">
        <div className="pt-6 pb-4 px-6">
          <Typography className="font-semibold text-center" variant="h4">
            Transfers
          </Typography>
          <div className="flex items-center justify-center mt-4">
            {tabs.map((tab, index) => (
              <ButtonBase
                className={clsx(
                  index === selectedTab
                    ? "bg-neutral-100 text-neutral-500"
                    : " bg-[#131A33]  text-white",
                  "px-9 py-[10px] rounded-md font-medium"
                )}
                onClick={() => handleTabChange(index)}
                key={index}
              >
                {tab.content}
              </ButtonBase>
            ))}
          </div>
        </div>

        <Divider />

        <TransferBulkTab />
      </Paper>

      <Paper className="mx-auto rounded-2xl max-w-[520px] p-6 mt-4">
        <div className="flex justify-between items-center px-6">
          <Typography className="text-netral-600">
            Recent Transactions
          </Typography>

          <ButtonBase className="text-primary-main font-medium">
            See All
          </ButtonBase>
        </div>

        <div>
          {[
            {
              accountName: "John Doe",
              accountNumber: "98734738828",
              bankName: "UBA",
              amount: 50000,
              image: "https://via.placeholder.com/150",
            },
            {
              accountName: "Jane Doe",
              accountNumber: "98734738828",
              bankName: "GTB",
              amount: 50000,
              image: "https://via.placeholder.com/150",
            },
            {
              accountName: "John Smith",
              accountNumber: "98734738828",
              bankName: "Zenith Bank",
              amount: 50000,
              image: "https://via.placeholder.com/150",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 px-6 pt-[18px]">
              <img
                src={item.image}
                alt="user"
                className="w-[40px] h-[40px] rounded-full"
              />
              <div className="flex flex-col gap-1">
                <Typography className="font-medium text-neutral-900">
                  {item.accountName}
                </Typography>
                <Typography className="text-neutral-500">
                  {item.accountNumber} {item.bankName}
                </Typography>
              </div>
              <CurrencyTypography className="font-medium text-neutral-900 ml-auto">
                {item.amount}
              </CurrencyTypography>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}

export const Component = Transfer;
