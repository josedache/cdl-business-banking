import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import {
  ButtonBase,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Icon,
  Popper,
} from "@mui/material";
import { getTextFieldProps } from "utils/formik/get-text-field-props.ts";
import PasswordTextField from "components/PasswordTextField";
import { AuthSignupFormikValues } from "modules/auth/types/auth-signup.ts";
import { userApi } from "apis/user";
import * as yup from "yup";
import useStepper from "hooks/use-stepper.ts";
import { Fragment, useMemo } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { DASHBOARD, SIGNIN } from "constants/urls.ts";
import { Icon as Iconify } from "@iconify/react";
import { getCheckFieldProps } from "utils/formik/get-check-field-props.ts";
import { extractSearchParams } from "utils/url/extract-search-params.ts";
import { cn } from "utils/cn.ts";
import usePopover from "hooks/use-popover.ts";
import { removeEmptyProperties } from "utils/object/remove-empty-properties.ts";
import clsx from "clsx";

function AuthSignup() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const location = useLocation();

  const step = Number(location.state?.step || 0);

  const [searchParams] = useSearchParams();

  const { referral_code } = extractSearchParams(searchParams, {
    referral_code: "",
  });

  const stepper = useStepper({ initialStep: step });

  const [signupUserMutation] = userApi.useSignupUserMutation();

  const [resendSignupLinkMutation, resendSignupLinkMutationResult] =
    userApi.useResendSignupLinkMutation();

  const passwordPopover = usePopover();

  const formik = useFormik<AuthSignupFormikValues>({
    initialValues: {
      // phone: "",
      email: "",
      // firstName: "",
      confirmPassword: "",
      password: "",
      // middleName: "",
      // lastName: "",
      acceptedTermsAndConditions: false,
      referralCode: referral_code ?? "",
    },
    validationSchema: yup.object({
      // firstName: yup.string().label("First Name").required(),
      // lastName: yup.string().label("Last Name").required(),
      // phone: yup.string().label("Phone").required(),
      email: yup.string().label("Email").email().trim().required(),
      password: yup
        .string()
        .label("Password")
        .trim()
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
      referralCode: yup.string().label("Referral Code").optional(),
    }),
    onSubmit: async (values) => {
      try {
        if (!values.acceptedTermsAndConditions) {
          enqueueSnackbar(`Read and accept terms and conditions`, {
            variant: "warning",
          });

          return;
        }
        switch (stepper.step) {
          case 0: {
            const data = await signupUserMutation({
              body: removeEmptyProperties(values),
            }).unwrap();
            enqueueSnackbar(data?.message || "Signed up Successfully!", {
              variant: "success",
            });

            stepper.next();
            break;
          }
          case 1: {
            navigate(DASHBOARD);
          }
        }
      } catch (error) {
        enqueueSnackbar(
          error?.message || error?.data?.message || "Failed to Sign up",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const referralCodeUserQueryResult = userApi.useGetReferralCodeUserQuery(
    useMemo(
      () => ({ params: { referralCode: formik.values.referralCode } }),
      [formik.values.referralCode]
    ),
    { skip: !formik.values.referralCode }
  );

  const referralCodeUser = referralCodeUserQueryResult.data?.data;

  async function sendOtp() {
    try {
      const response = await resendSignupLinkMutation({
        body: { email: formik.values.email },
      }).unwrap();
      enqueueSnackbar(response?.message || "Signup link sent to your email", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error?.message || error?.data?.message || "Failed to send OTP",
        {
          variant: "error",
        }
      );
    }
  }

  const step1 = (
    <Fragment key={0}>
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h5" className="text-center">
          Let’s create your account
        </Typography>
        <div className="grid gap-4 my-8">
          <TextField
            fullWidth
            label="Owner's Email Address"
            placeholder="Enter your Email Address"
            {...getTextFieldProps(formik, "email")}
          />
          <PasswordTextField
            fullWidth
            label="Choose Password"
            placeholder="Enter your password"
            {...getTextFieldProps(formik, "password")}
            onFocus={(e) => passwordPopover.setAnchorEl(e.target)}
            onBlur={(e) => {
              formik.getFieldProps("password").onBlur(e);
              passwordPopover.setAnchorEl(null);
            }}
          />
          <Popper
            open={passwordPopover.isOpen}
            anchorEl={passwordPopover.anchorEl}
            className="z-10"
          >
            <Paper className="p-4 space-y-4">
              <Typography variant="h6">Your Password must contain</Typography>
              <div className="space-y-4">
                {[
                  {
                    label: "Min. of 8 characters",
                    test: (value: string) => value.length >= 8,
                  },
                  {
                    label: "At least one number",
                    test: (value: string) => /\d/.test(value),
                  },
                  {
                    label: "Lower case character",
                    test: (value: string) => /[a-z]/.test(value),
                  },
                  {
                    label: "Upper case character",
                    test: (value: string) => /[A-Z]/.test(value),
                  },
                  {
                    label: "Special character",
                    test: (value: string) => /[!@#$%^&*]/.test(value),
                  },
                ].map(({ label, test }) => (
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      test(formik.values.password)
                        ? "text-success-main"
                        : "text-text-secondary"
                    )}
                  >
                    <Icon color="inherit">
                      <Iconify icon="material-symbols:check-box" />
                    </Icon>
                    <Typography color="textPrimary">{label}</Typography>
                  </div>
                ))}
              </div>
            </Paper>
          </Popper>
          <PasswordTextField
            fullWidth
            label="Confirm Password"
            placeholder="Re-enter your password"
            {...getTextFieldProps(formik, "confirmPassword")}
          />

          <div>
            <TextField
              fullWidth
              margin="normal"
              label="Referral code (Optional)"
              placeholder="Enter a referral code"
              {...getTextFieldProps(formik, "referralCode")}
            />
            <div className="flex items-center justify-start">
              {referralCodeUserQueryResult.isFetching ? (
                <div className="flex items-center gap-1 mb-2">
                  <CircularProgress size={12} thickness={8} />
                  <Typography
                    variant="body2"
                    color="primary"
                    className="font-bold"
                  >
                    Resolving Referral Code
                  </Typography>
                </div>
              ) : referralCodeUserQueryResult.isError ? (
                <Typography variant="body2" color="error" gutterBottom>
                  {(referralCodeUserQueryResult.error as any)?.message ||
                    "Invalid Referral Code"}
                </Typography>
              ) : referralCodeUser?.name && formik.values.referralCode ? (
                <div className="bg-mui-primary-lighter inline-block p-1 rounded-full mb-4">
                  <Typography
                    className="font-bold"
                    variant="body2"
                    color="primary"
                  >
                    {referralCodeUser?.name}
                  </Typography>
                </div>
              ) : null}
            </div>
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
          className="mb-4"
        >
          Next
        </LoadingButton>
        <FormControlLabel
          label={
            <Typography>
              By clicking the “Sign Up” button, you agree to Credit Direct
              Business{" "}
              <a
                className="text-primary-main"
                href="https://www.creditdirect.ng/loan-agreement-terms-conditions/"
                target="_blank"
              >
                Terms of acceptable use
              </a>{" "}
              and{" "}
              <a
                className="text-primary-main"
                href="https://www.creditdirect.ng/privacy-policy/"
                target="_blank"
              >
                Privacy Policy
              </a>
            </Typography>
          }
          control={<Checkbox />}
          {...getCheckFieldProps(formik, "acceptedTermsAndConditions")}
        />

        <Typography className="text-center mt-8 font-medium text-text-secondary">
          Already have an account?{" "}
          <Typography
            color="primary"
            component={Link}
            to={SIGNIN}
            className="font-medium"
          >
            Log in
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
          className="flex items-center gap-2"
          onClick={() => stepper.previous()}
        >
          <Iconify icon="weui:back-filled" fontSize={20} />
          <Typography>Go back</Typography>
        </ButtonBase>
        <div className="space-y-4 my-8">
          <div className="flex justify-center mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="19.5833"
                fill="#FFF3EE"
                stroke="#FECBB9"
                stroke-width="0.833333"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M21.7881 13.8578C20.4843 13.8251 19.5156 13.8251 18.2117 13.8578L18.1618 13.859C17.1556 13.8843 16.3277 13.905 15.6603 14.0211C14.9521 14.1443 14.3591 14.3842 13.8568 14.8877C13.3572 15.3887 13.118 15.9723 12.9968 16.6694C12.883 17.3235 12.8658 18.1307 12.845 19.1078L12.8439 19.158C12.8297 19.8233 12.8297 20.1766 12.8439 20.8418L12.845 20.8921C12.8658 21.8691 12.883 22.6763 12.9968 23.3305C13.118 24.0275 13.3572 24.6112 13.8568 25.1121C14.3591 25.6156 14.9521 25.8556 15.6604 25.9788C16.3277 26.0948 17.1556 26.1156 18.1618 26.1408L18.2117 26.1421C19.5156 26.1748 20.4843 26.1748 21.7881 26.142L21.838 26.1408C22.8442 26.1156 23.6722 26.0948 24.3395 25.9787C25.0477 25.8556 25.6407 25.6156 26.143 25.1121C26.6427 24.6112 26.8819 24.0275 27.0031 23.3305C27.1168 22.6763 27.134 21.8691 27.1549 20.8921L27.1559 20.8418C27.1701 20.1765 27.1701 19.8233 27.1559 19.158L27.1549 19.1078C27.134 18.1308 27.1168 17.3235 27.0031 16.6694C26.8819 15.9723 26.6426 15.3887 26.143 14.8877C25.8608 14.6048 25.5498 14.4051 25.2059 14.2625C25.1536 14.2339 25.0975 14.2124 25.0391 14.1987C24.8192 14.1211 24.5863 14.064 24.3395 14.0211C23.6722 13.905 22.8443 13.8843 21.838 13.859L21.7881 13.8578ZM25.7864 17.9001C25.7735 17.6298 25.7671 17.4946 25.6692 17.4406C25.5713 17.3867 25.451 17.4549 25.2103 17.5912L22.3864 19.1913C21.52 19.6822 20.7873 19.9999 19.9998 19.9999C19.2123 19.9999 18.4796 19.6822 17.6132 19.1913L14.7896 17.5914C14.5489 17.455 14.4285 17.3868 14.3306 17.4408C14.2327 17.4948 14.2263 17.6299 14.2134 17.9003C14.196 18.2646 14.1866 18.687 14.1759 19.1864C14.1621 19.8327 14.1621 20.1671 14.1759 20.8135C14.1982 21.8535 14.215 22.5595 14.3095 23.1028C14.3984 23.6144 14.5468 23.9184 14.8007 24.173C15.052 24.4248 15.3601 24.5758 15.889 24.6678C16.4477 24.765 17.1766 24.785 18.2452 24.8118C19.5267 24.8439 20.4731 24.8439 21.7547 24.8118C22.8233 24.785 23.5521 24.765 24.1109 24.6678C24.6398 24.5758 24.9479 24.4248 25.1991 24.1729C25.453 23.9184 25.6014 23.6144 25.6904 23.1028C25.7849 22.5595 25.8017 21.8534 25.8239 20.8134C25.8377 20.1671 25.8377 19.8327 25.8239 19.1864C25.8132 18.6869 25.8038 18.2645 25.7864 17.9001Z"
                fill="#C53D0D"
              />
            </svg>
          </div>
          <Typography variant="h5" className="text-center">
            Check your email to verify your account
          </Typography>
          <Typography
            variant="body1"
            className="font-medium text-center text-text-secondary"
          >
            Please check your inbox to complete your registration. If you don’t
            see it, be sure to check your Spam or Junk folders.
          </Typography>
        </div>
        <div className="flex items-center justify-center">
          <Typography className="text-center font-medium text-text-secondary flex items-center gap-1">
            Already have an account?{" "}
            <ButtonBase
              component="span"
              color="primary"
              className={clsx(
                "font-medium cursor-pointer py-0 text-primary-main",
                resendSignupLinkMutationResult.isLoading && "opacity-50"
              )}
              onClick={sendOtp}
              disabled={
                resendSignupLinkMutationResult.isLoading || !formik.values.email
              }
            >
              Resend Link
            </ButtonBase>
          </Typography>
        </div>
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

export default AuthSignup;

export const Component = AuthSignup;
