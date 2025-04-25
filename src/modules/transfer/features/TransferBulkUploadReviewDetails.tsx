import { Fragment, useMemo, useState } from "react";
import {
  Button,
  ButtonBase,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import { ColumnDef } from "@tanstack/react-table";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import TanStandardTable from "components/TanStandardTable";
import useTable from "hooks/use-table";
import { beneficiaryApi } from "apis/beneficiary";
import { BeneficiaryBatchReport } from "types/beneficiary";
import CurrencyTypography from "components/CurrencyTypography";
import { getCheckFieldProps } from "utils/formik/get-check-field-props";
import useToggle from "hooks/use-toggle";
import TransferAddEditBeneficiaryDialog from "./TransferAddEditBeneficiaryDialog";
import { useSnackbar } from "notistack";
import clsx from "clsx";

type TransferBulkUploadReviewDetailsProps = {
  batchNumber: string;
} & TransferBulkContentProps;

const emptyArray = [];

const TABS = {
  SUCCESS: "success",
  FAILED: "failed",
};

export default function TransferBulkUploadReviewDetails(
  props: TransferBulkUploadReviewDetailsProps
) {
  const { formik, batchNumber, stepper } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [selectedTab, setSelectedTab] = useState("");
  const [isOpenIndex, setIsOpenIndex] = useState<number | undefined>();
  const [beneficiaryInfo, setBeneficiaryInfo] = useState();

  const getBatchReportQuery = beneficiaryApi.useGetBeneficiaryBatchReportQuery({
    path: {
      batchNumber,
    },
  });
  const [
    resolveDuplicateBeneficiaryMutation,
    resolveDuplicateBeneficiaryMutationResult,
  ] = beneficiaryApi.useResolveDuplicateBeneficiaryMutation();

  const [isOpenBeneficiaryAddEditDialog, toggleOpenBeneficiaryAddEditDialog] =
    useToggle();

  const handleOpenEditBeneficiaryDialog = (info) => {
    setBeneficiaryInfo(info);
    toggleOpenBeneficiaryAddEditDialog();
  };

  const handleCloseAddEditBeneficiaryDialog = () => {
    setBeneficiaryInfo(undefined);
    toggleOpenBeneficiaryAddEditDialog();
  };
  const isActiveSelectedTab = (tab: string) => {
    return selectedTab === tab;
  };

  const handleSelectTab = (tab: string) => {
    if (isActiveSelectedTab(tab)) {
      setSelectedTab("");
      setIsOpenIndex([]);
    } else {
      setSelectedTab(tab);
    }
  };
  const handleOpenFailedChildTab = (index: number) => {
    if (isActiveChild(index)) {
      setIsOpenIndex(undefined as number | undefined);
    } else {
      setIsOpenIndex(Number(index));
    }
  };

  const isActiveChild = (index: number) => {
    return index === isOpenIndex;
  };

  const isAllBatchesSuccessful =
    getBatchReportQuery?.data?.data?.meta?.total ===
      getBatchReportQuery?.data?.data?.meta?.success || false;

  const noSuccessfulUploads =
    getBatchReportQuery?.data?.data?.meta?.success === 0;

  const allSuccessfulBatches = useMemo(
    () =>
      getBatchReportQuery?.data?.data?.beneficiaries?.filter(
        (beneficiary) => beneficiary.responseType === "success"
      ),
    [getBatchReportQuery?.data?.data?.beneficiaries]
  );

  const failedUploads = useMemo(
    () =>
      getBatchReportQuery?.data?.data?.beneficiaries?.filter(
        (beneficiary) => beneficiary.responseType !== "success"
      ),
    [getBatchReportQuery?.data?.data?.beneficiaries]
  );
  const failedUploadsGroupedByErrorMessages = failedUploads?.reduce(
    (acc, item) => {
      const errorMessage = item.message || "Unknown error";
      if (!acc[errorMessage]) {
        acc[errorMessage] = [];
      }
      acc[errorMessage].push(item);
      return acc;
    },
    {} as Record<string, BeneficiaryBatchReport[]>
  );
  const failedUploadsGroupedByErrorMessagesArray = Object.entries(
    failedUploadsGroupedByErrorMessages || {}
  ).map(([errorMessage, items]) => ({
    errorMessage,
    items,
  }));

  const columns: ColumnDef<BeneficiaryBatchReport>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "accountName",
        cell: ({ cell }) => (
          <div className="max-w-[100px]">
            <Tooltip title={cell?.getValue() as string}>
              <Typography className="text-neutral-700" noWrap>
                {(cell?.getValue() as string) || "----"}
              </Typography>
            </Tooltip>
          </div>
        ),
      },
      {
        header: "Name retrieved",
        accessorKey: "resolvedAccountName",
        cell: ({ cell }) => (
          <div className="max-w-[100px]">
            <Tooltip title={cell?.getValue() as string}>
              <Typography className="text-neutral-700" noWrap>
                {(cell?.getValue() as string) || "----"}
              </Typography>
            </Tooltip>
          </div>
        ),
      },
      {
        header: "Bank",
        accessorKey: "bankName",
        cell: ({ cell }) => (
          <div className="max-w-[100px]">
            <Tooltip title={cell?.getValue() as string}>
              <Typography className="text-neutral-700" noWrap>
                {(cell?.getValue() as string) || "----"}
              </Typography>
            </Tooltip>
          </div>
        ),
      },
      {
        header: "Account No.",
        accessorKey: "accountNumber",
        cell: ({ cell }) => (
          <div className="max-w-[80px]">
            <Tooltip title={cell?.getValue() as string}>
              <Typography className="text-neutral-700" noWrap>
                {(cell?.getValue() as string) || "----"}
              </Typography>
            </Tooltip>
          </div>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",

        cell: ({ cell, row }) => {
          return (
            <div className="flex items-center gap-2">
              {cell?.getValue() ? (
                <CurrencyTypography className="text-[#B96C07]">
                  {cell?.getValue() as string}
                </CurrencyTypography>
              ) : (
                <div>{(cell?.getValue() as string) || "---"}</div>
              )}
              {row?.original?.canEdit ? (
                <IconButton
                  onClick={() => handleOpenEditBeneficiaryDialog(row?.original)}
                >
                  <Icon
                    icon="lets-icons:edit-duotone"
                    width="20"
                    height="20"
                    className="text-primary-main"
                  />
                </IconButton>
              ) : null}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectedData = useMemo(() => {
    if (isAllBatchesSuccessful) {
      return allSuccessfulBatches;
    }
    if (selectedTab === TABS.SUCCESS) {
      return allSuccessfulBatches;
    } else if (selectedTab === TABS.FAILED) {
      return failedUploadsGroupedByErrorMessagesArray?.[isOpenIndex]?.items;
    }
    return emptyArray;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTab,
    isOpenIndex,
    isAllBatchesSuccessful,
    getBatchReportQuery?.data,
  ]);

  const successTableInstance = useTable({
    columns,
    data: selectedData,
  });

  const handleResolveDuplicateBeneficiary = async () => {
    try {
      await resolveDuplicateBeneficiaryMutation({
        path: {
          batchNumber,
        },
      }).unwrap();
    } catch (error) {
      enqueueSnackbar(
        error?.data?.error || "Error resolving duplicate beneficiaries",
        {
          variant: "error",
        }
      );
    }
  };
  return (
    <Paper elevation={0} className="mx-auto max-w-[768px]">
      <div className="p-6">
        <ButtonBase
          disableRipple
          disabled
          className="flex items-center gap-2"
          onClick={() => stepper.previous()}
        >
          <Icon icon="weui:back-filled" fontSize={20} />
          <Typography>Go back</Typography>
        </ButtonBase>
      </div>

      <Divider />
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4 p-6 h-[440px] overflow-y-auto scrollbar-hidden">
          <div>
            <div>
              <Typography variant="h5" className="font-semibold">
                Review details
              </Typography>
              <Typography className="text-neutral-500 max-w-[500px]">
                Ensure you confirm all your details before proceeding. All
                issues can be found in the Validation Report
              </Typography>

              <Button
                startIcon={<Icon icon="tabler:plus" />}
                variant="soft"
                className="mt-2"
                onClick={toggleOpenBeneficiaryAddEditDialog}
              >
                Add another Recipient
              </Button>
            </div>
          </div>

          {isAllBatchesSuccessful ? (
            <div>
              <TanStandardTable
                loading={getBatchReportQuery.isFetching}
                error={getBatchReportQuery.isError}
                onErrorRetry={getBatchReportQuery.refetch}
                onEmptyRetry={getBatchReportQuery.refetch}
                instance={successTableInstance}
                pagination={false}
              />
            </div>
          ) : (
            <div>
              <List disablePadding>
                <ListItemButton
                  onClick={() => handleSelectTab(TABS.SUCCESS)}
                  className="flex items-center gap-2 py-3"
                >
                  {isActiveSelectedTab(TABS.SUCCESS) ? (
                    <Icon
                      icon="ic:baseline-expand-less"
                      width="16"
                      height="16"
                      className="text-neutral-500"
                    />
                  ) : (
                    <Icon
                      icon="ic:baseline-expand-more"
                      width="16"
                      height="16"
                      className="text-neutral-500"
                    />
                  )}
                  <Icon
                    icon="carbon:checkmark-outline"
                    width="20"
                    height="20"
                    className="text-[#12B76A]"
                  />
                  <Typography className="flex-1 font-semibold">
                    {allSuccessfulBatches?.length} successfully uploaded
                  </Typography>

                  <div className="flex-1"></div>
                </ListItemButton>
                <Divider />
                <Collapse
                  in={isActiveSelectedTab(TABS.SUCCESS)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem>
                      <TanStandardTable
                        loading={getBatchReportQuery.isFetching}
                        error={getBatchReportQuery.isError}
                        onErrorRetry={getBatchReportQuery.refetch}
                        onEmptyRetry={getBatchReportQuery.refetch}
                        instance={successTableInstance}
                        pagination={false}
                      />
                    </ListItem>
                  </List>
                </Collapse>
              </List>

              <List disablePadding>
                <ListItemButton
                  onClick={() => handleSelectTab(TABS.FAILED)}
                  className="flex items-center gap-2 py-3"
                >
                  {isActiveSelectedTab(TABS.FAILED) ? (
                    <Icon
                      icon="ic:baseline-expand-less"
                      width="16"
                      height="16"
                      className="text-neutral-500"
                    />
                  ) : (
                    <Icon
                      icon="ic:baseline-expand-more"
                      width="16"
                      height="16"
                      className="text-neutral-500"
                    />
                  )}

                  <Icon
                    icon="hugeicons:alert-02"
                    width="20"
                    height="20"
                    className="text-[#F79009]"
                  />
                  <Typography className="flex-1 font-semibold">
                    Fix {failedUploads?.length} Accounts
                  </Typography>

                  <div className="flex-1"></div>
                </ListItemButton>
                <Divider />
                <Collapse
                  in={isActiveSelectedTab(TABS.FAILED)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {failedUploadsGroupedByErrorMessagesArray.map(
                      (failedGroup, index) => (
                        <Fragment>
                          <ListItemButton
                            onClick={() => handleOpenFailedChildTab(index)}
                            className="flex items-center gap-2 ml-10 mt-1 py-3"
                          >
                            {isActiveChild(index) ? (
                              <Icon
                                icon="ic:baseline-expand-less"
                                width="12"
                                height="12"
                              />
                            ) : (
                              <Icon
                                icon="ic:baseline-expand-more"
                                width="12"
                                height="12"
                              />
                            )}
                            <Icon
                              icon="hugeicons:alert-02"
                              width="20"
                              height="20"
                              className="text-[#F79009]"
                            />
                            <Typography className="flex-1 font-medium text-neutral-700">
                              {failedGroup?.errorMessage} (
                              {failedGroup?.items?.length}){" "}
                              {failedGroup?.items?.[0]?.responseType ===
                              "duplicate" ? (
                                <ButtonBase
                                  className={clsx(
                                    resolveDuplicateBeneficiaryMutationResult?.isLoading
                                      ? "opacity-[0.6]"
                                      : "",
                                    "text-primary-main font-semibold"
                                  )}
                                  disabled={
                                    resolveDuplicateBeneficiaryMutationResult?.isLoading
                                  }
                                  onClick={handleResolveDuplicateBeneficiary}
                                >
                                  Resolve All
                                </ButtonBase>
                              ) : (
                                ""
                              )}
                            </Typography>
                          </ListItemButton>
                          <Divider className="ml-10" />

                          <Collapse
                            in={isActiveChild(index)}
                            className="ml-10"
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div">
                              <TanStandardTable
                                loading={getBatchReportQuery.isFetching}
                                error={getBatchReportQuery.isError}
                                onErrorRetry={getBatchReportQuery.refetch}
                                onEmptyRetry={getBatchReportQuery.refetch}
                                instance={successTableInstance}
                                pagination={false}
                              />
                            </List>
                          </Collapse>
                        </Fragment>
                      )
                    )}
                  </List>
                </Collapse>
              </List>
            </div>
          )}
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-between items-center">
          <FormControlLabel
            control={<Checkbox />}
            {...getCheckFieldProps(formik, "confirmList")}
            className="text-neutral-500 font-light"
            label="I confirm that the details have been cross-checked and is accurate  "
          />
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={
              !formik.isValid ||
              !formik?.values?.confirmList ||
              noSuccessfulUploads
            }
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            Continue
          </LoadingButton>
        </div>
      </form>

      {isOpenBeneficiaryAddEditDialog && (
        <TransferAddEditBeneficiaryDialog
          open={isOpenBeneficiaryAddEditDialog}
          onClose={handleCloseAddEditBeneficiaryDialog}
          batchNumber={batchNumber}
          beneficiaryInfo={beneficiaryInfo}
          createBeneficiaryType={
            beneficiaryInfo === undefined
              ? "new_beneficiary_existing_bulk_upload"
              : "bulk_upload_error_resolution"
          }
          stepInfo={
            beneficiaryInfo &&
            `${
              failedUploads.findIndex(
                (item) => item._id === (beneficiaryInfo as any)?._id
              ) + 1
            }/${failedUploads?.length}`
          }
        />
      )}
    </Paper>
  );
}
