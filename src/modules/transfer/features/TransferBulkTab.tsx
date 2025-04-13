import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  CardActionArea,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { TransferContentProps } from "../types/TransferStepForm";

type TransferBulkTabProps = {} & TransferContentProps;

export default function TransferBulkTab(props: TransferBulkTabProps) {
  const { formik } = props;
  const hasList = true;

  const list = [
    {
      icon: "hugeicons:user-group-03",
      title: "Payroll",
      description: "Jimmy Agbaje, John Chuka, Mayowa and 12 others",
    },
    {
      icon: "hugeicons:user-group-03",
      title: "School Payment",
      description: "Jimmy Agbaje, John Chuka, Mayowa and 12 others",
    },
  ];

  return (
    <Fragment>
      {hasList ? (
        <div>
          <div className="px-6 pt-6 pb-8">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Choose a List</Typography>
              <Button
                startIcon={
                  <Icon icon="ic:baseline-plus" width="24" height="24" />
                }
                size="small"
                variant="soft"
              >
                Create new List
              </Button>
            </div>

            <div className="mt-8">
              {list.map(({ title, icon, description, ...rest }, index) => (
                <Fragment key={title}>
                  <CardActionArea
                    key={title}
                    className="flex gap-3 py-2 w-full"
                    {...rest}
                  >
                    <Paper
                      elevation={0}
                      className="rounded-full  bg-[#F4F5F5] p-2 w-fit"
                    >
                      <Icon icon={icon} width="20" height="20" />
                    </Paper>
                    <div className="flex-1">
                      <Typography className="font-medium text-neutral-900">
                        {title}
                      </Typography>
                      <Typography className="text-neutral-500 font-medium">
                        {description}
                      </Typography>
                    </div>
                    <Icon
                      icon="icon-park-outline:right"
                      width="24"
                      height="24"
                    />
                  </CardActionArea>
                  {list.length - 1 !== index && <Divider className="my-4" />}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="px-6 pt-6 pb-8">
            <Typography variant="h5">How Bulk Payouts works</Typography>

            {[
              "Upload a CSV with Beneficiaries you wish to payout to or Choose from Existing Beneficiaries.",
              "Review the Recipients.",
              "Complete the payout transaction.",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-[10px] mt-8 text-neutral-500"
              >
                <span className="text-[#C53D0D] w-2 h-2 p-3 rounded-full inline-flex justify-center items-center border border-[#FECBB9] bg-[#FFF3EE]">
                  {index + 1}
                </span>
                <Typography className="font-medium">{item}</Typography>
              </div>
            ))}
          </div>

          <div className="px-6 pt-6 pb-5">
            <div className="flex justify-between items-center">
              <Typography>Preview Sample</Typography>

              <Button size="small" variant="soft">
                Download Template
              </Button>
            </div>

            <div className="border border-[#E2E4E9] rounded-[16px] mt-4">
              <table className="table-auto  w-full border border-[#E2E4E9]  overflow-hidden rounded-[16px] ">
                <thead>
                  <tr>
                    {["Full Name", "Account Number", "Bank Name", "Amount"].map(
                      (item, index) => (
                        <th
                          key={index}
                          className="border bg-[#F9F9FA] border-[#E2E4E9] text-center  py-2"
                        >
                          <Typography>{item}</Typography>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((item) => (
                    <tr key={item}>
                      {["", "", "", ""].map((item) => (
                        <td
                          key={item}
                          className="border border-[#E2E4E9] text-center py-2 px-3"
                        >
                          <Skeleton className="h-[20px] w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Divider />

          <div className="px-6 py-5">
            <Button
              variant="gradient"
              className="w-full  text-white"
              type="submit"
            >
              Continues
            </Button>
          </div>
        </form>
      )}
    </Fragment>
  );
}
