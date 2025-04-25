import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  ButtonBase,
  Divider,
  Paper,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { useEffect, useState } from "react";

import Countdown from "components/Countdown";
import NumberInput from "components/NumberInput";
import OtpInput from "components/OtpInput";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";
import getCountdownDate from "utils/date/get-countdown-date";

type DashboardAccountSetupBusinessCacRegVerificationProps = {
  phone: string;
  expiration: number;
} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBusinessCacRegVerification(
  props: DashboardAccountSetupBusinessCacRegVerificationProps
) {
  const { phone, expiration, formik, stepper } = props;
  const [countdownDate, setCountdownDate] = useState<any>(getCountdownDate);

  function sendOtp() {}

  useEffect(() => {
    setCountdownDate(getCountdownDate(expiration));

    return () => {
      setCountdownDate(0);
    };
  }, [expiration]);

  return (
    <Paper elevation={0} className="mx-auto max-w-[520px]">
      <form onSubmit={formik.handleSubmit} className="max-w-[520px]">
        <div className="p-6">
          <ButtonBase
            disableRipple
            className="flex items-center gap-2"
            onClick={() => stepper.previous()}
          >
            <Icon icon="weui:back-filled" fontSize={20} />
            <Typography>Go back</Typography>
          </ButtonBase>
        </div>

        <Divider />
        <div className="px-6 pt-6 pb-8 flex justify-center items-center w-full">
          <div className="max-w-[416px] w-full">
            <div className="flex items-center flex-col w-full">
              <Typography variant="h5" className="text-center">
                Verification Required
              </Typography>
              <Typography className="text-neutral-500 text-center max-w-[354px] w-full">
                A 6-digit OTP has been sent to{" "}
                <span className="text-neutral-900">{phone}</span> Input the code
                here to continue
              </Typography>
            </div>
            <div className="grid justify-center gap-4  mt-8">
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
                                className=""
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
                              // disabled={
                              //   signupYieldUserMutationResult?.isLoading
                              // }
                              component={MuiLink}
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
        <Divider className="mb-5 mt-6" />
        <div className="flex justify-end px-5 pb-5">
          <LoadingButton
            variant="gradient"
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
