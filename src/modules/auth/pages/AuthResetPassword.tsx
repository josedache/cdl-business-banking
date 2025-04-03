import {
  ButtonBase,
  Typography,
  Link as MuiLink,
  TextField,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import useStepper from "hooks/use-stepper";
import { AuthResetPasswordValues } from "../types/auth-reset-password";
import { LoadingButton } from "@mui/lab";
import { SIGNIN, SIGNUP } from "constants/urls";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { AuthResetPasswordStep } from "../enums/auth-reset-password-step.ts";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import OtpInput from "components/OtpInput";
import PasswordTextField from "components/PasswordTextField";
import NumberInput from "components/NumberInput";

function AuthResetPassword() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // const [sendUserResetPasswordMutation, sendUserResetPasswordMutationResult] =
  //   userApi.useSendUserResetPasswordMutation();

  // const [verifyUserResetPasswordMutation] =
  //   userApi.useVerifyUserResetPasswordMutation();

  // const [countdownDate, setCountdownDate] = useState(getCountdownDate);

  // const [resetPasswordMutation] = userApi.useResetPasswordMutation();

  const stepper = useStepper({
    initialStep: getEnumStepIndex(AuthResetPasswordStep.REQUEST),
  });

  const enumStep = STEPS_INDEX[stepper.step];

  const formik = useFormik<AuthResetPasswordValues>({
    initialValues: {
      identifier: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      ...{
        [AuthResetPasswordStep.REQUEST]: {
          identifier: yup.string().label("Email Address").required(),
        },
        [AuthResetPasswordStep.VERIFY]: {
          otp: yup.string().label("OTP").required(),
        },
        [AuthResetPasswordStep.CHANGE]: {
          password: yup
            .string()
            .label("Password")
            .trim()
            .min(8, "Your password must be at least 8 characters long")
            .max(25)
            .matches(/^(?=.{8,})/, "Must Contain 8 Characters")
            .matches(/^(?=.*[a-z])/, "Must Contain One Lowercase")
            .matches(/^(?=.*[A-Z])/, "Must Contain One Uppercase")
            .matches(/^(?=.*\d)/, "Must contain a number")
            .matches(/^(?=.*[@$!%*?&#%])/, "Must contain a special character")
            .required(),
          confirmPassword: yup
            .string()
            .label("Confirm Password")
            .oneOf([yup.ref("password")], "Passwords must match")
            .required(),
        },
      }[enumStep],
    }),
    onSubmit: async () => {
      try {
        switch (enumStep) {
          case AuthResetPasswordStep.REQUEST: {
            // const data = await sendUserResetPasswordMutation({
            //   body: { identifier: values.identifier, device_id: "kdkdkdd" },
            // }).unwrap();
            // setCountdownDate(getCountdownDate());
            // enqueueSnackbar(data?.message || "Password reset otp sent", {
            //   variant: "success",
            // });
            break;
          }
          case AuthResetPasswordStep.VERIFY: {
            // const data = await verifyUserResetPasswordMutation({
            //   body: {
            //     otp: values.otp,
            //     channel: values.identifier.includes("@") ? "email" : "phone",
            //   },
            // }).unwrap();
            // enqueueSnackbar(data?.message || "OTP verified successfully!", {
            //   variant: "success",
            // });
            break;
          }
          case AuthResetPasswordStep.CHANGE: {
            // const data = await resetPasswordMutation({
            //   body: {
            //     password: values.password,
            //   },
            // }).unwrap();
            // enqueueSnackbar(data?.message || "Password reset successful", {
            //   variant: "success",
            // });
            break;
          }
          case AuthResetPasswordStep.SUCCESS: {
            return navigate(SIGNIN);
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

  // const handleResendOtpReset = async () => {
  //   try {
  //     const data = await sendUserResetPasswordMutation({
  //       body: { identifier: formik.values.identifier, device_id: "kdkdkdd" },
  //     }).unwrap();
  //     setCountdownDate(getCountdownDate());
  //     enqueueSnackbar("Password reset otp sent", {
  //       variant: "success",
  //     });
  //   } catch (error: any) {
  //     enqueueSnackbar(
  //       error?.data?.message || "Failed to resend password reset otp",
  //       {
  //         variant: "error",
  //       }
  //     );
  //   }
  // };

  const contents = [
    {
      title: "Reset your password",
      buttonTitle: "Submit",
      body: (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            placeholder="Enter your Email Address"
            className="placeholder:text-sm placeholder:font-medium "
            {...getTextFieldProps(formik, "identifier")}
          />
        </>
      ),
    },
    {
      title: "Verification Required",
      buttonTitle: "Verify Email Address",
      body: (
        <div className="flex flex-col items-center">
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

          {/* <Countdown date={countdownDate}>
            {(countdown) => {
              const isCodeSent =
                countdown.days ||
                countdown.minutes ||
                countdown.seconds ||
                countdown.seconds;

              return ( */}
          <>
            {/* {isSecondStep ? (
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
                  ) : ( */}
            <div className="flex items-center justify-center mt-6">
              <Typography className="text-center">
                Didn’t get the code?{" "}
                <ButtonBase
                  disableRipple
                  // disabled={
                  //   sendUserResetPasswordMutationResult.isLoading
                  // }
                  component={MuiLink}
                  // onClick={handleResendOtpReset as any}
                  className="underline text-text-primary font-bold"
                >
                  Resend Code.
                </ButtonBase>
              </Typography>
            </div>
            {/* )} */}
          </>
          {/* );
            }}
          </Countdown> */}
        </div>
      ),
    },
    {
      title: "Create new password",
      buttonTitle: "Reset password",
      body: (
        <div className="space-y-4">
          <PasswordTextField
            fullWidth
            margin="normal"
            label="New Password"
            {...getTextFieldProps(formik, "password")}
          />

          <PasswordTextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            {...getTextFieldProps(formik, "confirmPassword")}
          />
        </div>
      ),
    },
    {
      title: "",
      buttonTitle: "Continue",
      body: (
        <>
          <div className="border-b border-neutral-100 " />
          <ButtonBase>
            <Iconify
              icon="mingcute:check-circle-fill"
              fontSize={100}
              className="text-success-500 my-6"
            />
          </ButtonBase>

          <Typography variant="h5" className="font-semibold mt-6">
            Password reset successfully
          </Typography>
        </>
      ),
    },
  ];

  const content = contents[stepper.step];

  const isFirstStep = enumStep === AuthResetPasswordStep.REQUEST;
  const isThirdStep = enumStep === AuthResetPasswordStep.CHANGE;
  const isSecondStep = enumStep === AuthResetPasswordStep.VERIFY;

  return (
    <form
      onSubmit={formik.handleSubmit as any}
      className="h-full w-full flex flex-col justify-center items-center bg-white mt-12 text-center"
    >
      <Paper elevation={0} className="w-full sm:w-[520px] max-h-full overflow-auto">
        <div className=" ">
          {isSecondStep ? (
            <div className=" text-start px-6 py-6 border-b border-neutral-100">
              <ButtonBase
                className="flex items-center gap-1 mb-4 "
                onClick={() => stepper.previous()}
              >
                <Iconify
                  icon="material-symbols-light:chevron-left-rounded"
                  fontSize={24}
                />
                <Typography> Go back </Typography>
              </ButtonBase>
            </div>
          ) : null}
          <div className="flex flex-col justify-center items-center pt-8 pb-4 px-6">
            <Typography variant="h5" className="font-semibold ">
              {content?.title}
            </Typography>

            {isSecondStep ? (
              <Typography className="text-text-secondary w-4/5 pt-4 pb-2 text-sm font-medium">
                A 6-digit OTP has been sent to{" "}
                <span className="text-black"> *******un50@gmail.com.</span>{" "}
                Input the code here to continue
              </Typography>
            ) : null}
          </div>
        </div>

        <div className="px-5 md:px-8 ">{content?.body}</div>

        <div className="sticky bottom-0 p-5 md:p-8 bg-inherit z-10 space-y-2">
          <LoadingButton
            type="submit"
            fullWidth
            size="large"
            disabled={
              !formik.isValid ||
              [
                formik.values.identifier.length < 11,
                formik.values.otp.length < 6,
                formik.values.confirmPassword !== formik.values.password ||
                  !formik.values.password ||
                  !formik.values.confirmPassword,
              ][stepper.step]
            }
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            {content?.buttonTitle}
          </LoadingButton>

          {isFirstStep || isThirdStep ? (
            <Typography color="textSecondary" className="pt-12 font-medium">
              New to Credit Direct Business?{" "}
              <Typography
                color="primary"
                className="font-bold"
                component={Link}
                to={SIGNUP}
              >
                Sign Up
              </Typography>
            </Typography>
          ) : null}
        </div>
      </Paper>
    </form>
  );
}

export default AuthResetPassword;

export const Component = AuthResetPassword;

function getEnumStepIndex(enumStep: AuthResetPasswordStep) {
  const index = STEPS_INDEX.indexOf(enumStep);
  return index > -1 ? index : undefined;
}

function getCountdownDate() {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 5);
  return date;
}

const STEPS_INDEX = [
  AuthResetPasswordStep.REQUEST,
  AuthResetPasswordStep.VERIFY,
  AuthResetPasswordStep.CHANGE,
  AuthResetPasswordStep.SUCCESS,
];
