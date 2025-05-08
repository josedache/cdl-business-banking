import { ReactNode, useMemo } from "react";
import {
  Avatar,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Icon,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import useToggle from "hooks/use-toggle.ts";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton.tsx";
import TransactionIcon from "modules/transaction/features/TransactionIcon.tsx";
import { Transaction } from "types/transaction.ts";
import { transactionApi } from "apis/transaction.ts";
import { cn } from "utils/cn.ts";
import * as dfns from "date-fns";
import CurrencyTypography from "components/CurrencyTypography.tsx";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { Icon as Iconify } from "@iconify/react";
import useClipboard from "hooks/use-clipboard.ts";
import useStepper from "hooks/use-stepper.ts";
import { useSnackbar } from "notistack";
import { transferApi } from "apis/transfer.ts";
import { TRANSFER } from "constants/urls.ts";
import { useNavigate } from "react-router-dom";

function TransactionDetails(props: TransactionDetailsProps) {
  const {
    id,
    transaction: propsTransaction,
    children,
    onClose,
    ...restProps
  } = props;

  const clipboard = useClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isOpen, toggleOpen, setOpen] = useToggle();

  const stepper = useStepper();

  const transactionQueryResult = transactionApi.useGetTransactionQuery(
    useMemo(() => ({ path: { id } }), [id]),
    { skip: !(id || !propsTransaction) }
  );

  const transaction = propsTransaction ?? transactionQueryResult.data?.data;

  const localTransferQueryResult = transferApi.useGetTransferLocalQuery(
    useMemo(
      () => ({ path: { reference: transaction?.reference_number } }),
      [transaction]
    ),
    { skip: !transaction }
  );

  const localTransfer = localTransferQueryResult.data?.data;

  const isBulk = false;

  const isDebit = ![TransactionType.deposit, TransactionType.interest].includes(
    transaction?.transaction_type_id
  );

  function handleClose(e?: any, reason?: any) {
    onClose?.(e, reason);
    setOpen(false);
  }

  const [generateReceiptMutation, generateReceiptMutationResult] =
    transactionApi.useGenerateTransactionReceiptMutation();

  const handleDownloadReceipt = async () => {
    try {
      await generateReceiptMutation({
        path: {
          id: String(id),
        },
      }).unwrap();
    } catch (error) {
      enqueueSnackbar(
        error?.data?.error ||
          error?.data?.message ||
          "Error downloading receipt",
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} fullWidth {...restProps}>
        <DialogTitleXCloseButton onClose={handleClose}>
          {stepper.step ? (
            <ButtonBase
              disableRipple
              disableTouchRipple
              onClick={() => stepper.previous()}
              className="-ml-4 px-2"
            >
              <Icon>
                <Iconify icon="iconamoon:arrow-left-2-light" />
              </Icon>
              <Typography variant="body1" component="span">
                Go back
              </Typography>
            </ButtonBase>
          ) : (
            <>Transaction Details</>
          )}
        </DialogTitleXCloseButton>
        {
          [
            <DialogContent className="space-y-8">
              <div className="flex items-center gap-4">
                <TransactionIcon transaction={transaction} />
                <div>
                  <Typography
                    variant="h6"
                    className="space-x-1 font-medium"
                    gutterBottom
                  >
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
                  {transaction?.transaction_time ? (
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
                  ) : null}
                </div>
                <div className="flex-1" />
                <div>
                  <Typography
                    variant="h6"
                    className={cn(
                      "font-medium text-right",
                      isDebit ? "text-error-main" : "text-success-main"
                    )}
                    gutterBottom
                  >
                    {isDebit ? "-" : "+"}
                    <CurrencyTypography variant="inherit" component="span">
                      {transaction?.amount}
                    </CurrencyTypography>
                  </Typography>
                  <Typography variant="body2" className="capitalize text-right">
                    {transaction?.transaction_status}
                  </Typography>
                </div>
              </div>

              <div className="bg-neutral-100 p-4 rounded-lg space-y-6">
                {[
                  {
                    label: "Transaction type",
                    value: transaction?.transaction_type,
                  },
                  {
                    label: "Sent from",
                    value: `${transaction?.sender_bank} | ${transaction?.source_account_name}`,
                  },
                  {
                    label: "Sent To",
                    value: isBulk ? (
                      <>
                        {`${100} Recipients`}
                        <IconButton
                          size="small"
                          onClick={() => stepper.next()}
                          edge="end"
                        >
                          <Icon>
                            <Iconify icon="iconamoon:arrow-right-2-light" />
                          </Icon>
                        </IconButton>
                      </>
                    ) : (
                      `${transaction?.beneficiary_bank} | ${transaction?.beneficiary_account_number}`
                    ),
                  },
                  {
                    label: "Amount",
                    value: transaction?.amount,
                    type: "currency",
                  },
                  { label: "Remark", value: transaction?.note },
                  { label: "Transaction Fee", value: 0, type: "currency" },
                  {
                    label: "Transaction Reference",
                    value: transaction?.reference_number ? (
                      <>
                        {transaction?.reference_number}{" "}
                        <IconButton
                          onClick={() =>
                            clipboard.writeText(
                              String(transaction?.reference_number)
                            )
                          }
                        >
                          <Iconify icon="solar:copy-bold" />
                        </IconButton>
                      </>
                    ) : null,
                  },
                ].map(({ label, value, type }) => {
                  return (
                    <div className="grid grid-cols-2 gap-1 items-center">
                      <Typography className="text-neutral-500">
                        {label}
                      </Typography>
                      {type === "currency" ? (
                        <CurrencyTypography className="text-right">
                          {value as string}
                        </CurrencyTypography>
                      ) : (
                        <Typography className="text-right">{value}</Typography>
                      )}
                    </div>
                  );
                })}
              </div>

              <Paper variant="outlined" className="p-4 flex items-center gap-4">
                <IconButton variant="soft" disableRipple color="error">
                  <Icon>
                    <Iconify icon="typcn:warning" />
                  </Icon>
                </IconButton>
                <div className="flex-1">
                  <Typography
                    color="error"
                    // variant="h6"
                    className="font-medium"
                    gutterBottom
                  >
                    Report Transaction
                  </Typography>
                  <Typography variant="body2" className="text-neutral-500">
                    Report an issue with this payment
                  </Typography>
                </div>
                <Icon>
                  <Iconify icon="iconamoon:arrow-right-2-light" />
                </Icon>
              </Paper>
            </DialogContent>,
            <DialogContent className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <Typography variant="h6">Recipient List</Typography>
                <IconButton>
                  <Icon>
                    <Iconify icon="lucide:search" fontSize={18} />
                  </Icon>
                </IconButton>
              </div>
              <div className="space-y-4">
                {Array(8)
                  .fill(1)
                  .map(() => {
                    return (
                      <div className="flex items-center gap-4">
                        <Avatar>J</Avatar>
                        <div className="flex-1">
                          <Typography gutterBottom>
                            Segun Akinnibosun
                          </Typography>
                          <Typography variant="body2">
                            2085481196 United Bank of Africa
                          </Typography>
                        </div>
                        <CurrencyTypography>50000</CurrencyTypography>
                      </div>
                    );
                  })}
              </div>
            </DialogContent>,
          ][stepper.step]
        }
        <DialogActions className="grid grid-cols-2 p-6">
          <Button
            onClick={handleDownloadReceipt}
            disabled={generateReceiptMutationResult?.isLoading}
            variant="gradient"
          >
            Share Receipt
          </Button>
          <Button
            variant="outlined"
            disabled={!localTransfer}
            onClick={() => {
              navigate(TRANSFER, {
                state: {
                  accountNumber: localTransfer?.accountNumber,
                  accountName: localTransfer?.accountName,
                  bankSortCode: localTransfer?.bankSortCode,
                  nameEnquiryReference: localTransfer?.nameEnquiryReference,
                },
              });
            }}
          >
            Send Again
          </Button>
        </DialogActions>
      </Dialog>

      {typeof children === "function"
        ? children({ isOpen, toggleOpen, setOpen })
        : children}
    </>
  );
}

export default TransactionDetails;

export type TransactionDetailsProps = {
  id: number;
  transaction?: Transaction;
  open?: boolean;
  children?:
    | ReactNode
    | ((props: {
        isOpen: boolean;
        toggleOpen: () => void;
        setOpen: (p: any) => void;
      }) => any);
} & Omit<DialogProps, "children" | "open" | "id">;
