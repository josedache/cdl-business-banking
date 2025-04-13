import { ButtonBase, Paper, Typography } from "@mui/material";
import CurrencyTypography from "components/CurrencyTypography";

export default function TransferRecentTransactions() {
  return (
    <Paper elevation={0} className="mx-auto rounded-2xl max-w-[520px] p-6 ">
      <div className="flex justify-between items-center">
        <Typography className="text-netral-600">Recent Transactions</Typography>

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
          <div key={index} className="flex items-center gap-4 pt-[18px]">
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
  );
}
