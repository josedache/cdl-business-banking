import { Container, Step, StepLabel, Stepper } from "@mui/material";
import clsx from "clsx";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";

import StepperConnector from "components/StepperConnector";
import StepperIcon from "components/StepperIcon";
import { TRANSFER_BUK_STEPS_ENUM } from "../enums/TransferBulkStepsEnum";
import useStepper from "hooks/use-stepper";
import { TransferBulkFormikValues } from "../types/TransferBulkStepForm";
import TransferBulkUpload from "../features/TransferBulkUpload";
import TransferBulkUploadProgress from "../features/TransferBulkUploadProgress";
import TransferBulkUploadReviewDetails from "../features/TransferBulkUploadReviewDetails";

export default function TransferBulk() {
  const stepper = useStepper();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik<TransferBulkFormikValues>({
    initialValues: {
      file: "",
    },
    validationSchema: yup.object({
      ...[
        {
          file: yup.string().label("File").required("Required"),
        },
      ][stepper.step],
    }),
    onSubmit: async (values) => {
      try {
        switch (stepper.step) {
          case TRANSFER_BUK_STEPS_ENUM.LIST: {
            stepper.go(TRANSFER_BUK_STEPS_ENUM.LIST_PROGRESS);
            enqueueSnackbar("Successful!", {
              variant: "success",
            });
            break;
          }
          case TRANSFER_BUK_STEPS_ENUM.LIST_PROGRESS: {
            stepper.go(TRANSFER_BUK_STEPS_ENUM.LIST_REVIEW);
            enqueueSnackbar("Successful!", {
              variant: "success",
            });
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
      verified: true,
      hasStepper: true,
    },
    {
      title: "Recipient",
      tab: TRANSFER_BUK_STEPS_ENUM.RECIPIENT,
      parentTab: TRANSFER_BUK_STEPS_ENUM.RECIPIENT,
      parent: true,
      content: <div></div>,
      verified: true,
      hasStepper: true,
    },
    {
      title: "Summary",
      tab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parentTab: TRANSFER_BUK_STEPS_ENUM.SUMMARY,
      parent: true,
      content: <div></div>,
      verified: true,
      hasStepper: true,
    },
    {
      title: "List Progress",
      tab: TRANSFER_BUK_STEPS_ENUM.LIST_PROGRESS,
      parentTab: TRANSFER_BUK_STEPS_ENUM.LIST,
      parent: false,
      content: <TransferBulkUploadProgress {...contentProps} />,
      verified: true,
      hasStepper: true,
    },
    {
      title: "Review details",
      tab: TRANSFER_BUK_STEPS_ENUM.LIST_REVIEW,
      parentTab: TRANSFER_BUK_STEPS_ENUM.LIST,
      parent: false,
      content: <TransferBulkUploadReviewDetails {...contentProps} />,
      verified: true,
      hasStepper: true,
    },
  ];

  const currentStep = steps[stepper.step];
  const parentSteps = steps.filter((step) => step.parent === true);
  const parentStepIndex = parentSteps?.findIndex(
    (step) => step?.tab === currentStep?.parentTab
  );

  return (
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
  );
}

export const Component = TransferBulk;
