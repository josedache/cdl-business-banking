import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import {
  ButtonBase,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { getTextFieldProps } from "utils/formik/get-text-field-props.ts";
import PasswordTextField from "components/PasswordTextField";
import { AuthSigninFormikValues } from "modules/auth/types/auth-signin.ts";
import { userApi } from "apis/user.ts";
import * as yup from "yup";
import useStepper from "hooks/use-stepper.ts";
import { Fragment, useState } from "react";
import Countdown from "components/Countdown";
import { LoadingButton } from "@mui/lab";
import OtpInput from "components/OtpInput";
import NumberInput from "components/NumberInput";
import { Link, useNavigate } from "react-router-dom";
import { DASHBOARD, RESET_PASSWORD, SIGNUP } from "constants/urls.ts";
import { Icon as Iconify } from "@iconify/react";

function AuthSignin() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const stepper = useStepper();

  const [loginUserMutation] = userApi.useLoginUserMutation();
  const [verifyUserOtpMutation] = userApi.useVerifyUserOtpMutation();

  const [countdownDate, setCountdownDate] = useState(getCountdownDate);

  const formik = useFormik<AuthSigninFormikValues>({
    initialValues: {
      email: "",
      password: "",
      otp: "",
    },
    validateOnMount: true,
    validationSchema: yup.object({
      ...[
        {
          email: yup.string().label("Email").email().trim().required(),
          password: yup.string().label("Password").trim().required(),
        },
        {
          otp: yup.string().label("OTP").length(6).trim().required(),
        },
      ][stepper.step],
    }),
    onSubmit: async (values) => {
      try {
        switch (stepper.step) {
          case 0: {
            const data = await loginUserMutation({
              body: {
                email: values.email,
                password: values.password,
              },
            }).unwrap();
            enqueueSnackbar(
              data?.message || "An OTP is sent to your email address",
              {
                variant: "success",
              }
            );

            if (!data?.data?.is_verified && !data?.data?.token) {
              return navigate(SIGNUP, { state: { step: 1 } });
            }

            setCountdownDate(getCountdownDate());
            stepper.next();
            break;
          }
          case 1: {
            const data = await verifyUserOtpMutation({
              body: { otp: values.otp, reason: "verify_login_2fa" },
            }).unwrap();
            enqueueSnackbar(data?.message || "Logged In Successfully!", {
              variant: "success",
            });
            navigate(DASHBOARD);
          }
        }
      } catch (error) {
        enqueueSnackbar(
          error?.message || error?.data?.message || "Failed to Login",
          {
            variant: "error",
          }
        );
      }
    },
  });

  function sendOtp() {}

  const step1 = (
    <Fragment key={0}>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h5" className="text-center">
          Log in to your account
        </Typography>
        <div className="grid gap-4 my-8">
          <TextField
            fullWidth
            label="Email Address"
            placeholder="Enter your Email Address"
            {...getTextFieldProps(formik, "email")}
          />
          <div className="relative">
            <PasswordTextField
              fullWidth
              label="Password"
              placeholder="Enter your password"
              {...getTextFieldProps(formik, "password")}
            />
            <Typography
              variant="body2"
              component={Link}
              to={RESET_PASSWORD}
              className="absolute right-0 top-0 text-primary-main font-medium"
            >
              Forgot Password?
            </Typography>
          </div>
        </div>
        <LoadingButton
          variant="gradient"
          type="submit"
          fullWidth
          disabled={!formik.isValid || !formik.dirty}
          size="large"
          loading={formik.isSubmitting}
          loadingPosition="end"
          endIcon={<></>}
        >
          Log in
        </LoadingButton>

        <Typography className="text-center mt-8 font-medium text-text-secondary">
          New to Credit Direct Business?{" "}
          <Typography
            color="primary"
            component={Link}
            to={SIGNUP}
            className="font-medium"
          >
            Sign up
          </Typography>
        </Typography>
      </form>
    </Fragment>
  );

  const step2 = (
    <Fragment key={1}>
      <form onSubmit={formik.handleSubmit}>
        <ButtonBase
          disableRipple
          className="flex items-center gap-2 mb-4"
          onClick={() => stepper.previous()}
        >
          <Iconify icon="weui:back-filled" fontSize={20} />
          <Typography>Go back</Typography>
        </ButtonBase>
        <div className="space-y-4">
          <Typography variant="h5" className="text-center">
            Verification Required
          </Typography>
          <Typography
            variant="body1"
            className="font-medium text-center text-text-secondary"
          >
            A 6-digit OTP has been sent to{" "}
            {formik.values?.email?.replace(/\w(?=\w{0,2}@)/g, "*") ||
              "*******@***"}
            . Input the code here to continue
          </Typography>
        </div>
        <div className="grid gap-4 my-8">
          <OtpInput
            value={formik.values.otp}
            onChange={(otp) => {
              formik.setFieldValue("otp", otp);
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
          <Countdown date={countdownDate}>
            {(countdown) => {
              const isCodeSent =
                countdown.days ||
                countdown.minutes ||
                countdown.seconds ||
                countdown.seconds;

              return (
                <>
                  <div className="flex items-center justify-center">
                    <Typography className="text-center">
                      Didn’t receive OTP?{" "}
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
                          className=""
                        >
                          Resend OTP
                        </ButtonBase>
                      )}
                    </Typography>
                  </div>
                </>
              );
            }}
          </Countdown>
        </div>
        <LoadingButton
          variant="gradient"
          type="submit"
          fullWidth
          disabled={!formik.isValid || !formik.dirty}
          size="large"
          loading={formik.isSubmitting}
          loadingPosition="end"
          endIcon={<></>}
        >
          Verify Email Address
        </LoadingButton>
      </form>
    </Fragment>
  );

  return (
    <>
      <Paper elevation={0} className="p-4 md:p-8">
        {[step1, step2][stepper.step]}
      </Paper>
    </>
  );
}

export default AuthSignin;

export const Component = AuthSignin;

function getCountdownDate() {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 5);
  return date;
}
