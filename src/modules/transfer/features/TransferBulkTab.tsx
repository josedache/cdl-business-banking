import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  CardActionArea,
  ClickAwayListener,
  Divider,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Skeleton,
  Typography,
} from "@mui/material";
import { Fragment } from "react";

import { TransferContentProps } from "../types/TransferStepForm";
import usePopover from "hooks/use-popover";
import { generatePath, useNavigate } from "react-router-dom";
import { TRANSFER_BULK, TRANSFER_BULK_DETAILS } from "constants/urls";
import { beneficiaryApi } from "apis/beneficiary";
import LoadingContent from "components/LoadingContent";
import useToggle from "hooks/use-toggle";
import TransferAddEditBeneficiaryDialog from "./TransferAddEditBeneficiaryDialog";

type TransferBulkTabProps = {} & TransferContentProps;

export default function TransferBulkTab(props: TransferBulkTabProps) {
  const { formik } = props;

  const actionPopover = usePopover();
  const navigate = useNavigate();
  const getAllBatchesQuery = beneficiaryApi.useGetBeneficiaryBatchesQuery();

  const [isOpenBeneficiaryAddEditDialog, toggleOpenBeneficiaryAddEditDialog] =
    useToggle();

  const getBeneficiarySampleTemplateQuery =
    beneficiaryApi.useGetBeneficiariesTemplateSampleQuery({});

  const [downloadTemplateSample, downloadTemplateSampleResult] =
    beneficiaryApi.useLazyDownloadBeneficiariesTemplateSampleQuery({});

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateSample({}).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <LoadingContent
        loading={getAllBatchesQuery?.isLoading}
        error={getAllBatchesQuery?.isError}
        onRetry={getAllBatchesQuery?.refetch}
        renderLoading={() => (
          <div className="px-6 pt-6 pb-8 w-full">
            <div className="flex justify-between items-center">
              <Skeleton
                variant="text"
                className="h-[35px] w-full max-w-[132px]"
              />
              <Skeleton
                variant="text"
                className="h-[60px] w-full max-w-[142px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 pt-[18px] w-full">
              {Array(5)
                .fill(5)
                .map(() => (
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex flex-col flex-1 w-full gap-1">
                      <Skeleton variant="text" width={100} height={20} />
                      <Skeleton
                        variant="text"
                        className="w-full max-w-[300px] h-[20px]"
                      />
                    </div>
                    <Skeleton variant="text" width={50} height={20} />
                  </div>
                ))}
            </div>
          </div>
        )}
      >
        {() => (
          <div>
            {getAllBatchesQuery?.data?.data?.length >= 1 ? (
              <div className="max-h-[440px] overflow-scroll scrollbar-hidden">
                <div className="px-6 pt-6 pb-8">
                  <div className="flex items-center justify-between">
                    <Typography variant="h5">Choose a List</Typography>
                    <div>
                      <Button
                        startIcon={
                          <Icon
                            icon="ic:baseline-plus"
                            width="24"
                            height="24"
                          />
                        }
                        onClick={
                          actionPopover.isOpen
                            ? () => {}
                            : actionPopover.togglePopover
                        }
                        size="small"
                        variant="soft"
                      >
                        Create new List
                      </Button>

                      <Popper
                        sx={{ zIndex: 1 }}
                        open={actionPopover.isOpen}
                        anchorEl={actionPopover.anchorEl}
                        transition
                        disablePortal
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === "bottom"
                                  ? "center top"
                                  : "center bottom",
                            }}
                          >
                            <Paper className="rounded-2xl mt-2">
                              <ClickAwayListener
                                onClickAway={actionPopover.togglePopover}
                              >
                                <MenuList autoFocusItem>
                                  {[
                                    {
                                      icon: "tabler:upload",
                                      name: "Upload CSV",
                                      onClick: () => {
                                        navigate(TRANSFER_BULK);
                                      },
                                    },
                                    {
                                      icon: "mage:file-2",
                                      name: "Add recipients manually",
                                      onClick:
                                        toggleOpenBeneficiaryAddEditDialog,
                                    },
                                  ].map(({ name, icon, ...rest }) => (
                                    <MenuItem key={name} {...rest}>
                                      <Icon
                                        icon={icon}
                                        width="20"
                                        height="20"
                                        className="mr-2"
                                      />
                                      {name}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </div>
                  </div>

                  <div className="mt-8">
                    {getAllBatchesQuery?.data?.data?.map(
                      (
                        {
                          beneficiary_batch_name,
                          beneficiary_sample,
                          beneficiary_batch_number,
                          beneficiary_count,
                          ...rest
                        },
                        index
                      ) => (
                        <Fragment key={beneficiary_batch_name}>
                          <CardActionArea
                            key={beneficiary_batch_name}
                            className="flex items-center gap-3 py-5 w-full"
                            onClick={() => {
                              navigate(
                                generatePath(TRANSFER_BULK_DETAILS, {
                                  id: beneficiary_batch_number,
                                })
                              );
                            }}
                            {...rest}
                          >
                            <Paper
                              elevation={0}
                              className="rounded-full flex w-10 h-10 justify-center items-center  bg-[#F4F5F5]"
                            >
                              <Icon
                                icon="hugeicons:user-group-03"
                                width="20"
                                height="20"
                              />
                            </Paper>
                            <div className="flex-1">
                              <Typography className="font-medium text-neutral-900">
                                {beneficiary_batch_name || "----"}
                              </Typography>
                              <Typography className="text-neutral-500 capitalize font-medium w-full">
                                {beneficiary_sample
                                  ?.map((beene) => beene?.toLocaleLowerCase())
                                  .join(", ")}{" "}
                                and{" "}
                                {Number(beneficiary_count) >
                                beneficiary_sample?.length
                                  ? Number(beneficiary_count) -
                                    beneficiary_sample?.length
                                  : 0}{" "}
                                Others
                              </Typography>
                            </div>
                            <Icon
                              icon="icon-park-outline:right"
                              width="24"
                              height="24"
                              className="text-neutral-500"
                            />
                          </CardActionArea>
                          {getAllBatchesQuery?.data?.data.length - 1 !==
                            index && <Divider />}
                        </Fragment>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                <div className="px-6 pt-6 pb-8">
                  <Typography variant="h5">How Bulk Payouts works</Typography>

                  {[
                    "Upload a Excel with Beneficiaries you wish to payout to or Choose from Existing Beneficiaries.",
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

                    <Button
                      onClick={handleDownloadTemplate}
                      loading={downloadTemplateSampleResult?.isFetching}
                      size="small"
                      variant="soft"
                    >
                      Download Template
                    </Button>
                  </div>

                  <div className="border border-[#E2E4E9] rounded-[16px] mt-4">
                    <LoadingContent
                      loading={getBeneficiarySampleTemplateQuery.isLoading}
                      error={getBeneficiarySampleTemplateQuery.isError}
                      renderLoading={() => <TransferBulkLoader />}
                      onRetry={getBeneficiarySampleTemplateQuery?.refetch}
                    >
                      <table className="table-auto  w-full border border-[#E2E4E9]  overflow-hidden rounded-[16px] ">
                        <thead>
                          <tr>
                            {Object.keys(
                              getBeneficiarySampleTemplateQuery?.data
                                ?.data?.[0] || {}
                            ).map((item, index) => (
                              <th
                                key={index}
                                className="border bg-[#F9F9FA] border-[#E2E4E9] text-center  py-2 px-1"
                              >
                                <Typography variant="body2">{item}</Typography>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {getBeneficiarySampleTemplateQuery?.data?.data.map(
                            (item) => (
                              <tr key={String(item)}>
                                {Object.values(item).map((item) => (
                                  <td
                                    key={item}
                                    className="border border-[#E2E4E9] text-center py-2 px-2"
                                  >
                                    <Typography
                                      variant="caption"
                                      className="font-medium"
                                    >
                                      {item}
                                    </Typography>
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </LoadingContent>
                  </div>
                </div>

                <Divider />

                <div className="px-6 py-5">
                  <Button
                    variant="gradient"
                    className="w-full  text-white"
                    type="submit"
                    size="large"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </LoadingContent>

      {isOpenBeneficiaryAddEditDialog && (
        <TransferAddEditBeneficiaryDialog
          open={isOpenBeneficiaryAddEditDialog}
          onClose={toggleOpenBeneficiaryAddEditDialog}
          createBeneficiaryType="new_beneficiary_new_manual_bulk_creation"
        />
      )}
    </Fragment>
  );
}

export function TransferBulkLoader() {
  return (
    <table className="table-auto  w-full border border-[#E2E4E9]  overflow-hidden rounded-[16px] ">
      <thead>
        <tr>
          {Array(4).map((item, index) => (
            <th
              key={index}
              className="border bg-[#F9F9FA] border-[#E2E4E9] text-center  py-2"
            >
              <Typography>{item}</Typography>
            </th>
          ))}
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
  );
}
