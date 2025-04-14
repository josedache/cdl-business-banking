import { useNavigate } from "react-router-dom";
import { ButtonBase, Divider, Paper } from "@mui/material";
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
import { transferApi } from "apis/transfer";
import TransferSingleEnterPaymentOtp from "../features/TransferSingleEnterPaymentOtp";

export default function Transfer() {
  const { enqueueSnackbar } = useSnackbar();
  const stepper = useStepper();
  const navigate = useNavigate();

  const [transferMutation, transferMutationResult] =
    transferApi.useTransferMutation();
  const [completeTransferMutation] = transferApi.useCompleteTransferMutation();

  const formik = useFormik<TransferSetupFormikValues>({
    initialValues: {
      accountName: "",
      accountNumber: "",
      bankSortCode: "",
      amount: "",

      walletId: "",
      nameEnquiryReference: "",
      narration: "",
      transactionPin: "",
      reference: "",

      shouldAddBeneficiary: false,
      otp: "",
    },
    validationSchema: yup.object({
      ...[
        {
          accountName: yup.string().label("Account Name"),
          amount: yup.string().label("Amount").min(1).required(),
          bankSortCode: yup.string().label("Bank").required().required(),
          accountNumber: yup
            .string()
            .label("Account Number")
            .min(10)
            .max(10)
            .required(),
          narration: yup.string().label("Narration"),
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
            const resp = await transferMutation({
              body: {
                walletId: Number(values.walletId),
                amount: Number(values.amount),
                nameEnquiryReference: values?.nameEnquiryReference || "",
                transactionPin: values?.transactionPin,
                ...(values.narration ? { narration: values.narration } : {}),
              },
            }).unwrap();
            formik.setFieldValue("reference", resp?.data?.transfer?.reference);
            stepper.go(TRANSFER_STEPS_ENUM.SINGLE_PAYMENT_OTP);
            break;
          }
          case TRANSFER_STEPS_ENUM.SINGLE_PAYMENT_OTP: {
            const resp = await completeTransferMutation({
              body: {
                shouldAddBeneficiary: values?.shouldAddBeneficiary,
                otp: values?.otp,
              },
              path: {
                reference: values?.reference,
              },
            }).unwrap();
            if (resp.data?.isSuccessful) {
              stepper.go(TRANSFER_STEPS_ENUM.SINGLE_SUCCESS);
            } else {
              stepper.go(TRANSFER_STEPS_ENUM.SINGLE_FAILED);
            }
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
        console.log("error", error);
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
      title: "Payment OTP",
      tab: TRANSFER_STEPS_ENUM.SINGLE_PAYMENT_OTP,
      content: (
        <TransferSingleEnterPaymentOtp
          {...contentProps}
          phone={transferMutationResult?.data?.data?.phone || ""}
        />
      ),
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

  console.log({ formik });

  return (
    <div>
      {currentStep?.external ? (
        <>{currentStep.content}</>
      ) : (
        <Paper
          elevation={0}
          className="mx-auto border border-neutral-100  rounded-2xl max-w-[520px]"
        >
          <div className="pt-4 pb-4 px-6">
            <div className="flex items-center justify-center">
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
