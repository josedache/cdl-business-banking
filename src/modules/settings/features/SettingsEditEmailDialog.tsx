import {
  ButtonBase,
  Dialog,
  DialogProps,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import useStepper from "hooks/use-stepper";
import { useState } from "react";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { SettingsEditEmailValues } from "../types/settings-edit-email";
import * as yup from "yup";
import { SettingsEditEmailStep } from "../enums/settings-editemail-step";
import { useSnackbar } from "notistack";
import OtpInput from "components/OtpInput";
import NumberInput from "components/NumberInput";
import Countdown from "components/Countdown";
import { LoadingButton } from "@mui/lab";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { userApi } from "apis/user";
import useAuthUser from "hooks/use-auth-user";

type SettingsEditEmailDialogProps = {
  onClose: () => void;
} & DialogProps;

const SettingsEditEmailDialog = (props: SettingsEditEmailDialogProps) => {
  const { onClose, ...rest } = props;
  const stepper = useStepper({ initialStep: SettingsEditEmailStep.CHANGE });
  const [countdownDate, setCountdownDate] = useState(getCountdownDate);
  const { enqueueSnackbar } = useSnackbar();
  const enumStep = stepper.step;
  const authUser = useAuthUser();

  const [userEditEmaildMutation] = userApi.useUpdateUsersDetailsMutation();
  const [verifyUserOtpMutation] = userApi.useVerifyUserOtpMutation();

  const formik = useFormik<SettingsEditEmailValues>({
    initialValues: {
      oldEmail: "",
      newEmail: "",
      otp: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      ...{
        [SettingsEditEmailStep.CHANGE]: {
          oldEmail: yup.string().label("Email").email().trim().required(),
          newEmail: yup.string().label("Email").email().trim().required(),
        },
        [SettingsEditEmailStep.VERIFY]: {
          otp: yup.string().label("OTP").length(6).trim().required(),
        },
        [SettingsEditEmailStep.SUCCESS]: {},
      }[enumStep],
    }),
    onSubmit: async (values) => {
      try {
        switch (enumStep) {
          case SettingsEditEmailStep.CHANGE: {
            const data = await userEditEmaildMutation({
              body: { oldEmail: values.oldEmail, newEmail: values.newEmail },
            }).unwrap();
            setCountdownDate(getCountdownDate());
            enqueueSnackbar(data?.message || "Edit email otp sent", {
              variant: "success",
            });
            break;
          }
          case SettingsEditEmailStep.VERIFY: {
            const data = await verifyUserOtpMutation({
              body: {
                reason: "update_email",
                otp: values.otp,
                email: values.newEmail,
                rcNumber: authUser?.info?.businesses[0]?.rcNumber,
              },
            }).unwrap();
            enqueueSnackbar(data?.message || "OTP verified successfully!", {
              variant: "success",
            });
            break;
          }
          case SettingsEditEmailStep.SUCCESS: {
            onClose();
            break;
          }
          default:
            break;
        }

        return stepper.next();
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to update email", {
          variant: "error",
        });
      }
    },
  });

  const handleResendOtpReset = async () => {
    try {
      const data = await userEditEmaildMutation({
        body: {
          oldEmail: formik.values.oldEmail,
          newEmail: formik.values.newEmail,
        },
      }).unwrap();
      setCountdownDate(getCountdownDate());
      enqueueSnackbar(data?.message || "Edit email otp sent", {
        variant: "success",
      });
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || "Failed to resend otp", {
        variant: "error",
      });
    }
  };

  const tabs = [
    {
      title: "Edit Email Address",
      buttonTitle: "Verify",
      content: (
        <div>
          <TextField
            fullWidth
            margin="normal"
            label="Old Email Address"
            placeholder="Enter your old email address"
            {...getTextFieldProps(formik, "oldEmail")}
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Email Address"
            placeholder="Enter your new email address"
            {...getTextFieldProps(formik, "newEmail")}
          />
        </div>
      ),
    },
    {
      title: " ",
      buttonTitle: "Verify Email Address",
      content: (
        <div className="flex flex-col items-center px-5 mt-6">
          <div className="px-5 md:px-12">
            <OtpInput
              value={formik.values.otp}
              onChange={(otp) => {
                formik.setFieldValue("otp", otp);
              }}
              numInputs={6}
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
          <Countdown date={countdownDate}>
            {(countdown) => {
              const isCodeSent =
                countdown.days || countdown.minutes || countdown.seconds;
              return (
                <div className="mt-6">
                  {isCodeSent ? (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="text-center"
                    >
                      Resend OTP in{" "}
                      <Typography
                        component="span"
                        color="primary"
                        className="font-semibold"
                      >
                        {countdown.minutes}:
                        {countdown.seconds < 10
                          ? `0${countdown.seconds}`
                          : countdown.seconds}
                      </Typography>
                    </Typography>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Typography className="text-center">
                        Didn’t get the code?{" "}
                        <ButtonBase
                          disableRipple
                          // disabled={
                          //   sendUserResetPasswordMutationResult?.isLoading
                          // }
                          // component={MuiLink}
                          onClick={handleResendOtpReset as any}
                          className="font-bold text-primary-main"
                        >
                          Resend Code.
                        </ButtonBase>
                      </Typography>
                    </div>
                  )}
                </div>
              );
            }}
          </Countdown>

          <div className="text-center  w-full">
            <Typography className="font-semibold py-5"> Or </Typography>
            <div className="flex gap-5 w-full">
              <LoadingButton
                variant="outlined"
                fullWidth
                startIcon={
                  <Iconify
                    icon="hugeicons:call-ringing-02"
                    width="20"
                    height="20"
                  />
                }
                className="border-gray-300 text-black font-semibold"
              >
                Call me
              </LoadingButton>

              <LoadingButton
                variant="outlined"
                fullWidth
                startIcon={
                  <Iconify icon="hugeicons:pin-code" width="20" height="20" />
                }
                className="border-gray-300 text-black font-semibold"
              >
                USSD Code
              </LoadingButton>
            </div>
          </div>
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
            Email changed successfully
          </Typography>
        </div>
      ),
    },
  ];

  const isFirstStep = enumStep === SettingsEditEmailStep.CHANGE;
  const isSecondStep = enumStep === SettingsEditEmailStep.VERIFY;
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
        {isSecondStep ? (
          <>
            <Typography variant="h5" className="font-semibold text-center mt-1">
              Verification Required
            </Typography>
            <Typography className="text-text-secondary mx-auto text-center w-3/5 pb-2 text-sm font-medium mt-4">
              A 6-digit OTP has been sent to{" "}
              <span className="text-black">
                {authUser?.info?.email?.replace(/\w(?=\w{0,2}@)/g, "*") ||
                  "*******@***"}
              </span>
              . Input the code here to continue
            </Typography>
          </>
        ) : null}
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

export default SettingsEditEmailDialog;

function getCountdownDate() {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 5);
  return date;
}
