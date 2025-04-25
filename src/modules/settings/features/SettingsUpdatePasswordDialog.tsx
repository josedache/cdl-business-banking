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
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { SettingsUpdatePasswordStep } from "../enums/settings-updatepassword-step";
import PasswordTextField from "components/PasswordTextField";
import { SettingsUpdatePasswordValues } from "../types/settings-update-password";

type SettingsUpdatePasswordDialogProps = {
  onClose: () => void;
} & DialogProps;

const SettingsUpdatePasswordDialog = (
  props: SettingsUpdatePasswordDialogProps
) => {
  const { onClose, ...rest } = props;
  const stepper = useStepper({
    initialStep: SettingsUpdatePasswordStep.CHANGE,
  });

  const { enqueueSnackbar } = useSnackbar();
  const enumStep = stepper.step;

  const formik = useFormik<SettingsUpdatePasswordValues>({
    initialValues: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      ...{
        [SettingsUpdatePasswordStep.CHANGE]: {
            oldPassword: yup
            .string()
            .label("Old Password")
            .required(),
          newPassword: yup
            .string()
            .label("New Password")
            .trim()
            .min(8, "Your password must be at least 8 characters long")
            .max(25)
            .matches(/^(?=.{8,})/, "Must Contain 8 Characters")
            .matches(/^(?=.*[a-z])/, "Must Contain One Lowercase")
            .matches(/^(?=.*[A-Z])/, "Must Contain One Uppercase")
            .matches(/^(?=.*\d)/, "Must contain a number")
            .matches(/^(?=.*[@$!%*?&#%])/, "Must contain a special character")
            .required(),
          confirmNewPassword: yup
            .string()
            .label("Confirm Password")
            .oneOf([yup.ref("password")], "Passwords must match")
            .required(),
        },
        [SettingsUpdatePasswordStep.SUCCESS]: {},
      }[enumStep],
    }),
    onSubmit: async () => {
      try {
        switch (enumStep) {
          case SettingsUpdatePasswordStep.CHANGE: {
            // const data = await sendUserResetPasswordMutation({
            //   body: { email: values.email},
            // }).unwrap()
            // setCountdownDate(getCountdownDate());
            // enqueueSnackbar(data?.message || "Password reset otp sent", {
            //   variant: "success",
            // });
            break;
          }
          case SettingsUpdatePasswordStep.SUCCESS: {
            onClose();
            break;
          }
          default:
            break;
        }

        return stepper.next();
      } catch (error: any) {
        enqueueSnackbar(
          error?.data?.message || "Failed to process password reset",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const tabs = [
    {
      title: "Update Password",
      buttonTitle: "Save Password",
      content: (
        <div className="space-y-4 mt-6">
          <PasswordTextField
            fullWidth
            margin="normal"
            label="Old Password"
            placeholder="Enter your password"
            {...getTextFieldProps(formik, "oldPassword")}
          />

          <PasswordTextField
            fullWidth
            margin="normal"
            label="New Password"
            placeholder="Re-enter your password"
            {...getTextFieldProps(formik, "newPassword")}
          />

          <PasswordTextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            placeholder="Re-enter your password"
            {...getTextFieldProps(formik, "confirmNewPassword")}
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
            Password changed successfully
          </Typography>
        </div>
      ),
    },
  ];

  const isFirstStep = enumStep === SettingsUpdatePasswordStep.CHANGE;
  return (
    <Dialog fullWidth maxWidth="sm" {...rest}>
      <form onSubmit={formik.handleSubmit as any} className=" ">
        <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
          <Typography
            variant="h5"
            className={`font-semibold ${isFirstStep ? "text-start" : "text-center py-2"}`}
          >
            {tabs[stepper.step]?.title}
          </Typography>
        </DialogTitleXCloseButton>
        <Divider />

        <div className="px-6">{tabs[stepper.step]?.content}</div>
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

export default SettingsUpdatePasswordDialog;
