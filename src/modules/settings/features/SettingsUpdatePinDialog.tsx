import {
  ButtonBase,
  Dialog,
  DialogProps,
  Divider,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import useStepper from "hooks/use-stepper";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { SettingsUpdatePinStep } from "../enums/settings-updatepin-step";
import OtpInput from "components/OtpInput";
import NumberInput from "components/NumberInput";
import { SettingsUpdatePinValues } from "../types/settings-update-pin";
import { userApi } from "apis/user";

type SettingsUpdatePinDialogProps = {
  onClose: () => void;
} & DialogProps;

const SettingsUpdatePinDialog = (props: SettingsUpdatePinDialogProps) => {
  const { onClose, ...rest } = props;
  const stepper = useStepper({
    initialStep: SettingsUpdatePinStep.CHANGE,
  });

  const { enqueueSnackbar } = useSnackbar();
  const enumStep = stepper.step;

  const [updatePinMutation] = userApi.useUpdatePinMutation();

  const formik = useFormik<SettingsUpdatePinValues>({
    initialValues: {
      oldPin: "",
      newPin: "",
      confirmNewPin: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      ...{
        [SettingsUpdatePinStep.CHANGE]: {
          oldPin: yup.string().label("OTP").length(6).trim().required(),
          newPin: yup.string().label("OTP").length(6).trim().required(),
          confirmNewPin: yup.string().label("OTP").length(6).trim().required(),
        },
        [SettingsUpdatePinStep.SUCCESS]: {},
      }[enumStep],
    }),
    onSubmit: async (values) => {
      try {
        switch (enumStep) {
          case SettingsUpdatePinStep.CHANGE: {
            const data = await updatePinMutation({
              body: {
                oldPin: values.oldPin,
                newPin: values.newPin,
                confirmNewPin: values.confirmNewPin,
              },
            }).unwrap();
            enqueueSnackbar(data?.message || "Pin reset otp sent", {
              variant: "success",
            });
            break;
          }
          case SettingsUpdatePinStep.SUCCESS: {
            onClose();
            break;
          }
          default:
            break;
        }

        return stepper.next();
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to process pin reset", {
          variant: "error",
        });
      }
    },
  });

  const tabs = [
    {
      title: "Update PIN",
      description:
        "The payment PIN must contain numbers which cannot be repeated or consecutive.",
      buttonTitle: "Save Pin",
      content: (
        <div className="space-y-2 mt-6">
          <Typography>Enter Old PIN</Typography>
          <OtpInput
            value={formik.values.oldPin}
            onChange={(oldPin) => {
              formik.setFieldValue("oldPin", oldPin);
            }}
            numInputs={6}
            shouldAutoFocus
            inputType="password"
            slot={{ input: NumberInput }}
            slotProps={{
              input: {
                style: { opacity: formik.isSubmitting ? 0.5 : 1 },
                disabled: formik.isSubmitting,
              },
            }}
          />
          <Typography className="mt-5 font-medium">Enter New PIN</Typography>
          <OtpInput
            value={formik.values.newPin}
            onChange={(newPin) => {
              formik.setFieldValue("newPin", newPin);
            }}
            numInputs={6}
            shouldAutoFocus
            inputType="password"
            slot={{ input: NumberInput }}
            slotProps={{
              input: {
                style: { opacity: formik.isSubmitting ? 0.5 : 1 },
                disabled: formik.isSubmitting,
              },
            }}
          />
          <Typography className=" mt-5 font-medium">Confirm New PIN</Typography>
          <OtpInput
            value={formik.values.confirmNewPin}
            onChange={(confirmNewPin) => {
              formik.setFieldValue("confirmNewPin", confirmNewPin);
            }}
            numInputs={6}
            inputType="password"
            shouldAutoFocus
            slot={{ input: NumberInput }}
            slotProps={{
              input: {
                style: { opacity: formik.isSubmitting ? 0.5 : 1 },
                disabled: formik.isSubmitting,
              },
            }}
          />
        </div>
      ),
    },
    {
      title: "",
      buttonTitle: "Continue",
      content: (
        <div className="flex flex-col justify-center items-center">
          <div className=" py-2 " />
          <ButtonBase className="rounded-full p-1 mt-6 bg-success-100">
            <Iconify
              icon="mingcute:check-circle-fill"
              fontSize={80}
              className="text-success-500 "
            />
          </ButtonBase>
          <Typography variant="h5" className="font-semibold mt-6">
            Pin changed successfully
          </Typography>
        </div>
      ),
    },
  ];

  const isFirstStep = enumStep === SettingsUpdatePinStep.CHANGE;
  return (
    <Dialog fullWidth maxWidth="sm" {...rest}>
      <form onSubmit={formik.handleSubmit as any} className=" ">
        <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
          <Typography variant="h5" className="font-semibold text-start">
            {tabs[stepper.step]?.title}
          </Typography>
        </DialogTitleXCloseButton>
        <Divider />

        <div className="px-6">
          <Typography className="font-medium mt-6 ">
            {tabs[stepper.step]?.description}
          </Typography>
          {tabs[stepper.step]?.content}
        </div>
        <Divider className="py-3" />
        <div className="sticky bottom-0 p-6 flex ml-auto">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            // disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
            loadingPosition="end"
            className={`flex ${isFirstStep ? "ml-auto px-10 " : " w-full"}`}
          >
            {tabs[stepper.step]?.buttonTitle}
          </LoadingButton>
        </div>
      </form>
    </Dialog>
  );
};

export default SettingsUpdatePinDialog;
