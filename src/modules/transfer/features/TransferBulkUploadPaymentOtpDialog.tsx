import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Typography,
} from "@mui/material";

import { TransferContentProps } from "../types/TransferStepForm";
import OtpInput from "components/OtpInput";
import NumberInput from "components/NumberInput";
import { useEffect, useState } from "react";
import { userApi } from "apis/user";
import { useSnackbar } from "notistack";
import Countdown from "components/Countdown";
import getCountdownDate from "utils/date/get-countdown-date";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";

type TransferBulkUploadPaymentOtpDialogProps = {
  phone: string;
  onClose: () => void;
} & TransferContentProps &
  Omit<DialogProps, "children">;

export default function TransferBulkUploadPaymentOtpDialog(
  props: TransferBulkUploadPaymentOtpDialogProps
) {
  const { formik, phone, onClose, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [countdownDate, setCountdownDate] = useState<any>(getCountdownDate);

  const [resendOtpMutation, resendOtpMutationResult] =
    userApi.useUserSendOtpMutation();
  const [requestCallOtpMutation, requestCallOtpMutationResult] =
    userApi.useUserGetVoiceOtpMutation();

  const sendOtp = async () => {
    try {
      const resp = await resendOtpMutation({
        body: {
          reason: "complete_transfer",
        },
      }).unwrap();
      setCountdownDate(getCountdownDate(300));

      enqueueSnackbar(resp?.message || "OTP sent successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error?.data?.error || "Error sending OTP, please try again",
        {
          variant: "error",
        }
      );
    }
  };

  const requestCallOtp = async () => {
    try {
      const resp = await requestCallOtpMutation({}).unwrap();

      enqueueSnackbar(resp?.message || "OTP sent successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error?.data?.error || "Error sending OTP, please try again",
        {
          variant: "error",
        }
      );
    }
  };

  useEffect(() => {
    setCountdownDate(getCountdownDate(300));

    return () => {
      setCountdownDate(0);
    };
  }, []);

  const identifier = phone;
  return (
    <Dialog {...rest} className="px-0">
      <DialogTitleXCloseButton onClose={onClose} />
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <div className="px-6 pt-6 flex justify-center items-center w-full">
            <div className="max-w-[416px] w-full">
              <div className="flex items-center flex-col w-full">
                <Typography variant="h5" className="text-center">
                  Verification Required
                </Typography>
                <Typography className="text-neutral-500 text-center max-w-[354px] w-full">
                  A 6-digit OTP has been sent to{" "}
                  <span className="text-neutral-900">{identifier}</span> Input
                  the code here to continue
                </Typography>
              </div>
              <div className="grid justify-center gap-4 mt-8">
                <OtpInput
                  value={formik.values.otp}
                  onChange={(otp) => {
                    formik.setFieldValue("otp", otp);
                  }}
                  numInputs={6}
                  shouldAutoFocus
                  // inputType="password"
                  slot={{ input: NumberInput }}
                  slotProps={{
                    input: {
                      style: { opacity: formik.isSubmitting ? 0.5 : 1 },
                      disabled: formik.isSubmitting,
                    },
                  }}
                />
                <div>
                  <Countdown date={countdownDate}>
                    {(countdown) => {
                      const isCodeSent =
                        countdown.days ||
                        countdown.minutes ||
                        countdown.seconds ||
                        countdown.seconds;

                      return (
                        <>
                          <div className="flex gap-2 items-center justify-center">
                            <Typography className="text-center">
                              Didn’t receive code?{" "}
                            </Typography>
                            {isCodeSent ? (
                              <Typography
                                variant="body2"
                                color="primary"
                                className="text-center"
                              >
                                Resend OTP in{" "}
                                <Typography
                                  component="span"
                                  color="primary"
                                  className="font-semibold text-primary-main"
                                >
                                  {countdown.minutes}:
                                  {countdown.seconds < 10
                                    ? `0${countdown.seconds}`
                                    : countdown.seconds}
                                </Typography>
                              </Typography>
                            ) : (
                              <ButtonBase
                                disableRipple
                                color="primary"
                                disabled={resendOtpMutationResult?.isLoading}
                                onClick={sendOtp}
                                className="font-semibold text-primary-main"
                              >
                                Resend OTP
                              </ButtonBase>
                            )}
                          </div>
                        </>
                      );
                    }}
                  </Countdown>
                </div>
              </div>
            </div>
          </div>

          <Typography className="mt-8 text-center font-semibold">Or</Typography>

          <div className="grid grid-cols-2 px-6 gap-4 mt-6">
            <Button
              startIcon={
                <Icon icon="hugeicons:call-ringing-04" width="20" height="20" />
              }
              variant="outlined"
              color="neutral"
              fullWidth
              disabled={
                requestCallOtpMutationResult?.isLoading || formik.isSubmitting
              }
              onClick={requestCallOtp}
            >
              Call me
            </Button>

            <Button
              startIcon={
                <Icon icon="hugeicons:pin-code" width="20" height="20" />
              }
              variant="outlined"
              color="neutral"
              fullWidth
            >
              USSD Code
            </Button>
          </div>
          <Divider className="mt-12" />
          <div className="px-4 py-4 flex">
            <LoadingButton
              variant="gradient"
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              size="large"
              loading={formik.isSubmitting}
              loadingPosition="end"
              fullWidth
              endIcon={<></>}
            >
              Verify Otp
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
