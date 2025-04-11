import { useNavigate } from "react-router-dom";
import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import { TransferSetupFormikValues } from "../types/TransferStepForm";
import * as yup from "yup";
import { useFormik } from "formik";

import useStepper from "hooks/use-stepper.ts";
import { DASHBOARD } from "constants/urls";
import TransferBulkTab from "../features/TransferBulkTab";
import TransferSingle from "../features/TransferSingle";
import TransferRecentTransactions from "../features/TransferRecentTransactions";
import TransferSingleConfirmNewTransfer from "../features/TransferSingleConfirmNewTransfer";
import { TRANSFER_STEPS_ENUM } from "../enums/TransferStepsEnum";
import TransferSingleEnterPaymentPin from "../features/TransferSingleEnterPaymentPin";
import TransferSingleSuccess from "../features/TransferSingleSuccess";
import TransferSingleFailed from "../features/TransferSingleFailed";

export default function Transfer() {
  const { enqueueSnackbar } = useSnackbar();
  const stepper = useStepper();
  const navigate = useNavigate();

  const formik = useFormik<TransferSetupFormikValues>({
    initialValues: {
      accountName: "",
      accountNumber: "",
      amount: "",

      transactionPin: "",
    },
    validationSchema: yup.object({
      ...[
        {
          accountName: yup.string().label("Account Name"),
          amount: yup.string().label("Amount").min(1).required(),
          accountNumber: yup
            .string()
            .label("Account Number")
            .min(10)
            .max(10)
            .required(),
        },
        {},
        {},
        {
          transactionPin: yup
            .string()
            .label("Transaction Pin")
            .min(6)
            .required(),
        },
      ][stepper.step],
    }),
    onSubmit: async (values) => {
      try {
        switch (stepper.step) {
          case TRANSFER_STEPS_ENUM.SINGLE: {
            stepper.go(TRANSFER_STEPS_ENUM.SINGLE_CONFIRM_NEW_TRANSFER);

            break;
          }
          case TRANSFER_STEPS_ENUM.BULK: {
            stepper.go(TRANSFER_STEPS_ENUM.BULK);
            break;
          }
          case TRANSFER_STEPS_ENUM.SINGLE_CONFIRM_NEW_TRANSFER: {
            stepper.go(TRANSFER_STEPS_ENUM.SINGLE_PAYMENT_PIN);
            break;
          }
          case TRANSFER_STEPS_ENUM.SINGLE_PAYMENT_PIN: {
            stepper.go(TRANSFER_STEPS_ENUM.SINGLE_SUCCESS);
            break;
          }
          case TRANSFER_STEPS_ENUM.SINGLE_SUCCESS: {
            navigate(DASHBOARD);
            break;
          }
          case TRANSFER_STEPS_ENUM.SINGLE_FAILED: {
            navigate(DASHBOARD);
            break;
          }
        }
      } catch (error) {
        enqueueSnackbar(error?.message || error?.data?.message || "Failed", {
          variant: "error",
        });
      }
    },
  });

  const contentProps = { formik, stepper };

  const steps = [
    {
      title: "Single Transfer",
      tab: TRANSFER_STEPS_ENUM.SINGLE,
      content: <TransferSingle {...contentProps} />,
      parentTab: TRANSFER_STEPS_ENUM.SINGLE,
      parent: true,
    },
    {
      title: "Bulk Transfer",
      tab: TRANSFER_STEPS_ENUM.BULK,
      content: <TransferBulkTab {...contentProps} />,
      parentTab: TRANSFER_STEPS_ENUM.BULK,
      parent: true,
    },
    {
      title: "Confirm New Transfer",
      tab: TRANSFER_STEPS_ENUM.SINGLE_CONFIRM_NEW_TRANSFER,
      content: <TransferSingleConfirmNewTransfer {...contentProps} />,
      parentTab: TRANSFER_STEPS_ENUM.SINGLE,
      parent: false,
      external: true,
      hideTransaction: true,
    },
    {
      title: "Payment Pin",
      tab: TRANSFER_STEPS_ENUM.SINGLE_PAYMENT_PIN,
      content: <TransferSingleEnterPaymentPin {...contentProps} />,
      parentTab: TRANSFER_STEPS_ENUM.SINGLE,
      parent: false,
      external: true,
      hideTransaction: true,
    },
    {
      title: "Single payment Success",
      tab: TRANSFER_STEPS_ENUM.SINGLE_SUCCESS,
      content: <TransferSingleSuccess {...contentProps} />,
      parentTab: TRANSFER_STEPS_ENUM.SINGLE,
      parent: false,
      external: true,
      hideTransaction: true,
    },

    {
      title: "Single payment Failed",
      tab: TRANSFER_STEPS_ENUM.SINGLE_FAILED,
      content: <TransferSingleFailed {...contentProps} />,
      parentTab: TRANSFER_STEPS_ENUM.SINGLE,
      parent: false,
      external: true,
      hideTransaction: true,
    },
  ];

  const currentStep = steps[stepper.step];
  const parentSteps = steps.filter((step) => step.parent === true);
  const parentStepIndex = parentSteps?.findIndex(
    (step) => step?.tab === currentStep?.parentTab
  );

  return (
    <div>
      {currentStep?.external ? (
        <>{currentStep.content}</>
      ) : (
        <Paper className="mx-auto border border-neutral-100  rounded-2xl max-w-[520px]">
          <div className="pt-6 pb-4 px-6">
            <Typography className="font-semibold text-center" variant="h4">
              Transfers
            </Typography>
            <div className="flex items-center justify-center mt-4">
              {parentSteps.map((tab, index) => (
                <ButtonBase
                  className={clsx(
                    parentStepIndex === tab.parentTab
                      ? "bg-[#131A33]  text-white"
                      : "bg-neutral-100 text-neutral-500",
                    "px-9 py-[10px] rounded-md font-medium"
                  )}
                  onClick={() => {
                    stepper.go(tab.tab);
                  }}
                  key={index}
                >
                  {tab.title}
                </ButtonBase>
              ))}
            </div>
          </div>

          <Divider />

          {currentStep?.content}
        </Paper>
      )}

      {currentStep.hideTransaction ? null : (
        <div className="mt-4">
          <TransferRecentTransactions />
        </div>
      )}
    </div>
  );
}

export const Component = Transfer;
