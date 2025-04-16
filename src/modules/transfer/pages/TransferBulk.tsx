import { useState } from "react";
import { Container, Step, StepLabel, Stepper } from "@mui/material";
import clsx from "clsx";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";

import StepperConnector from "components/StepperConnector";
import StepperIcon from "components/StepperIcon";
import { TRANSFER_BUK_STEPS_ENUM } from "../enums/TransferBulkStepsEnum";
import useStepper from "hooks/use-stepper";
import { TransferBulkFormikValues } from "../types/TransferBulkStepForm";
import TransferBulkUpload from "../features/TransferBulkUpload";
import TransferBulkUploadProgress from "../features/TransferBulkUploadProgress";
import TransferBulkUploadReviewDetails from "../features/TransferBulkUploadReviewDetails";
import TransferBulkUploadTransferSummary from "../features/TransferBulkUploadTransferSummary";
import { uploadApi } from "apis/upload";
import { beneficiaryApi } from "apis/beneficiary";
import TransferBulkUploadNameUpdate from "../features/TransferBulkUploadNameUpdate";
import TransferBulkUploadPaymentPinVerification from "../features/TransferBulkUploadPaymentPinVerification";
import TransferBulkUploadPaymentScheduled from "../features/TransferBulkUploadPaymentScheduled";
import TransferBulkUploadPaymentOtpDialog from "../features/TransferBulkUploadPaymentOtpDialog";
import useToggle from "hooks/use-toggle";
import { DASHBOARD } from "constants/urls";
import { transferApi } from "apis/transfer";

export default function TransferBulk() {
  const { id } = useParams();
  const [openOtpVerificationDialog, toggleOpenOtpVerificationDialog] =
    useToggle();

  const { enqueueSnackbar } = useSnackbar();
  const [batchNumber, setBatchNumber] = useState(id || "");
  const navigate = useNavigate();

  const isEdit = !!id;
  const stepper = useStepper({
    initialStep: Number(
      isEdit
        ? TRANSFER_BUK_STEPS_ENUM.LIST_REVIEW
        : TRANSFER_BUK_STEPS_ENUM.LIST
    ),
  });

  const [uploadFileMutation] = uploadApi.useFileUploadMutation();
  const [updateBatchMutation] =
    beneficiaryApi.useUpdateBeneficiaryBatchMutation();
  const [processBulkTransferMutation, processBulkTransferMutationResult] =
    transferApi.useBulkTransferMutation();
  const [verifyOtpMutation] =
    transferApi.useBulkTransferOtpVerificationMutation();
  const [verifyTransactionPinMutation] =
    transferApi.useBulkTransferPinVerificationMutation();

  const [processBatchMutation] =
    beneficiaryApi.useProcessBeneficiaryBatchMutation();

  const formik = useFormik<TransferBulkFormikValues>({
    initialValues: {
      file: "",
      transactionPin: "",
      name: "",
      otp: "",
      confirmList: false,
    },
    validationSchema: yup.object({
      ...[
        {
          file: yup.string().label("File").required("Required"),
        },
      ][stepper.step],
    }),
    onSubmit: async () => {
      try {
        switch (stepper.step) {
          case TRANSFER_BUK_STEPS_ENUM.LIST: {
            const resp = await uploadFileMutation({
              body: {
                file: values.file,
                uploadType: "bank_beneficiary",
              },
            }).unwrap();
            await processBatchMutation({
              path: {
                batchNumber: resp?.data?.uploadResponse?.batchNumber,
              },
            }).unwrap();
            stepper.go(TRANSFER_BUK_STEPS_ENUM.LIST_PROGRESS);
            setBatchNumber(resp?.data?.uploadResponse?.batchNumber);
            break;
          }
          case TRANSFER_BUK_STEPS_ENUM.LIST_PROGRESS: {
            stepper.go(TRANSFER_BUK_STEPS_ENUM.LIST_REVIEW);
            break;
          }
          case TRANSFER_BUK_STEPS_ENUM.LIST_REVIEW: {
            stepper.go(TRANSFER_BUK_STEPS_ENUM.LIST_NAME);
            break;
          }
          case TRANSFER_BUK_STEPS_ENUM.LIST_NAME: {
            if (values?.name) {
              await updateBatchMutation({
                body: {
                  batchName: values?.name,
                },
                path: {
                  batchNumber,
                },
              }).unwrap();
            }

            stepper.go(TRANSFER_BUK_STEPS_ENUM.TRANSFER_SUMMARY);
            break;
          }
          case TRANSFER_BUK_STEPS_ENUM.TRANSFER_SUMMARY: {
            if (openOtpVerificationDialog) {
              await verifyOtpMutation({
                body: {
                  otp: values.otp,
                },
                path: {
                  batchNumber:
                    processBulkTransferMutationResult?.data?.data
                      ?.transferBatchNumber,
                },
              }).unwrap();
              stepper.go(TRANSFER_BUK_STEPS_ENUM.PAYMENT_PIN);
              toggleOpenOtpVerificationDialog();
            } else {
              await processBulkTransferMutation({
                body: {
                  beneficiaryBatchNumber: batchNumber,
                },
              }).unwrap();
              toggleOpenOtpVerificationDialog();
            }
            break;
          }

          case TRANSFER_BUK_STEPS_ENUM.PAYMENT_PIN: {
            await verifyTransactionPinMutation({
              body: {
                transactionPin: values.transactionPin,
              },
              path: {
                batchNumber:
                  processBulkTransferMutationResult?.data?.data
                    ?.transferBatchNumber,
              },
            }).unwrap();
            stepper.go(TRANSFER_BUK_STEPS_ENUM.PAYMENT_SCHEDULED);
            break;
          }
          case TRANSFER_BUK_STEPS_ENUM.PAYMENT_SCHEDULED: {
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

  const contentProps = {
    formik,
    stepper,
  };

  const steps = [
    {
      title: "List",
      tab: TRANSFER_BUK_STEPS_ENUM.LIST,
      parentTab: TRANSFER_BUK_STEPS_ENUM.LIST,
      parent: true,
      content: <TransferBulkUpload {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Recipient",
      tab: TRANSFER_BUK_STEPS_ENUM.RECIPIENT,
      parentTab: TRANSFER_BUK_STEPS_ENUM.RECIPIENT,
      parent: true,
      content: <div></div>,
      hasStepper: true,
    },
    {
      title: "Summary",
      tab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parentTab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parent: true,
      content: <div></div>,
      hasStepper: true,
    },
    {
      title: "List Progress",
      tab: TRANSFER_BUK_STEPS_ENUM.LIST_PROGRESS,
      parentTab: TRANSFER_BUK_STEPS_ENUM.LIST,
      parent: false,
      content: (
        <TransferBulkUploadProgress
          {...contentProps}
          batchNumber={batchNumber}
        />
      ),
      hasStepper: true,
    },
    {
      title: "Review details",
      tab: TRANSFER_BUK_STEPS_ENUM.LIST_REVIEW,
      parentTab: TRANSFER_BUK_STEPS_ENUM.LIST,
      parent: false,
      content: (
        <TransferBulkUploadReviewDetails
          {...contentProps}
          batchNumber={batchNumber}
        />
      ),
      hasStepper: true,
    },
    {
      title: "List Name",
      tab: TRANSFER_BUK_STEPS_ENUM.LIST_NAME,
      parentTab: TRANSFER_BUK_STEPS_ENUM.RECIPIENT,
      parent: false,
      content: <TransferBulkUploadNameUpdate {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Transfer Summary",
      tab: TRANSFER_BUK_STEPS_ENUM.TRANSFER_SUMMARY,
      parentTab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parent: false,
      content: (
        <TransferBulkUploadTransferSummary
          {...contentProps}
          batchNumber={batchNumber}
        />
      ),
      hasStepper: true,
    },
    {
      title: "Payment Pin",
      tab: TRANSFER_BUK_STEPS_ENUM.PAYMENT_PIN,
      parentTab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parent: false,
      content: <TransferBulkUploadPaymentPinVerification {...contentProps} />,
      hasStepper: false,
    },
    {
      title: "Payment Scheduled",
      tab: TRANSFER_BUK_STEPS_ENUM.PAYMENT_SCHEDULED,
      parentTab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parent: false,
      content: <TransferBulkUploadPaymentScheduled {...contentProps} />,
      hasStepper: false,
    },
  ];

  const currentStep = steps[stepper.step];
  const parentSteps = steps.filter((step) => step.parent === true);
  const parentStepIndex = parentSteps?.findIndex(
    (step) => step?.tab === currentStep?.parentTab
  );

  return (
    <>
      {" "}
      <Container className="mt-5 mx-auto">
        <Stepper
          activeStep={parentStepIndex}
          connector={<StepperConnector />}
          className={clsx(
            "mb-5 max-w-[600px] mx-auto",
            currentStep?.hasStepper ? "visible" : "invisible"
          )}
        >
          {parentSteps.map(({ title }) => (
            <Step key={title}>
              <StepLabel StepIconComponent={StepperIcon}>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="mt-5">{currentStep?.content}</div>
      </Container>
      {openOtpVerificationDialog && (
        <TransferBulkUploadPaymentOtpDialog
          onClose={toggleOpenOtpVerificationDialog}
          phone={processBulkTransferMutationResult?.data?.data?.phone || ""}
          open={openOtpVerificationDialog}
          formik={formik as any}
          stepper={stepper}
        />
      )}
    </>
  );
}

export const Component = TransferBulk;
