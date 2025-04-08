import { useSnackbar } from "notistack";
import {
  ButtonBase,
  CardActionArea,
  Divider,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD } from "constants/urls.ts";
import { styled } from "@mui/material/styles";
import useStepper from "hooks/use-stepper.ts";
import { userApi } from "apis/user.ts";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { useFormik } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { LoadingButton } from "@mui/lab";
import NumberTextField from "components/NumberTextField";
import SecuredDataBadge from "components/SecuredDataBadge";
import { ONBOARDING_STEPS } from "../enums/onboardingStepsEnum";

function DashboardAccountSetup() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const stepper = useStepper();

  const [loginUserMutation] = userApi.useLoginUserMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      ...[
        {
          nin: yup.string().label("NIN").max(11),
        },
        {},
      ][stepper.step],
    }),
    onSubmit: async (values) => {
      try {
        switch (stepper.step) {
          case 0: {
            // const data = await loginUserMutation({ body: values }).unwrap();
            // enqueueSnackbar(data?.message || "Successfully!", {
            //   variant: "success",
            // });
            stepper.next();
            break;
          }
          case 1: {
            stepper.next();

            // navigate(DASHBOARD);
          }
        }
      } catch (error) {
        enqueueSnackbar(error?.message || error?.data?.message || "Failed", {
          variant: "error",
        });
      }
    },
  });

  const steps = [
    {
      title: "Provide NIN",
      key: ONBOARDING_STEPS.NIN,
      content: (
        <Fragment key={0}>
          <form onSubmit={formik.handleSubmit}>
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
            <div className="px-6 pt-4 pb-8">
              <Typography variant="h5" className="">
                Provide NIN
              </Typography>
              <Typography className=" text-neutral-500">
                We need your NIN to confirm your identity and keep your account
                secure
              </Typography>
              <NumberTextField
                freeSolo
                fullWidth
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 11,
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon
                          icon="hugeicons:security-lock"
                          width="24"
                          height="24"
                          className="text-neutral-950"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                label="NIN (National Identification Number)"
                placeholder="19392398293"
                className="mt-10"
                {...getTextFieldProps(formik, "nin")}
              />
              <FormHelperText>
                Enter your 11-digit NIN as it appears on your National ID slip.
              </FormHelperText>
            </div>
            <Divider />
            <div className="px-4 pb-4">
              <LoadingButton
                variant="gradient"
                type="submit"
                fullWidth
                // disabled={!formik.isValid || !formik.dirty}
                size="large"
                loading={formik.isSubmitting}
                loadingPosition="end"
                endIcon={<></>}
                className="my-5"
              >
                Verify NIN
              </LoadingButton>

              <div className="flex items-center justify-center gap-2">
                <SecuredDataBadge />
              </div>
            </div>
          </form>
        </Fragment>
      ),
      verified: true,
      hasStepper: true,
    },
    {
      title: "Provide BVN",
      key: ONBOARDING_STEPS.BVN,
      content: (
        <form onSubmit={formik.handleSubmit}>
          <div>{renderStepper()}</div>
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
          <div className="px-6 pt-4 pb-8">
            <Typography variant="h5" className="">
              Provide BVN
            </Typography>
            <Typography className=" text-neutral-500">
              Your BVN helps us link your bank account and unlock transactions.
            </Typography>
            <NumberTextField
              freeSolo
              fullWidth
              slotProps={{
                input: {
                  inputProps: {
                    maxLength: 11,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon
                        icon="hugeicons:security-lock"
                        width="24"
                        height="24"
                        className="text-neutral-950"
                      />
                    </InputAdornment>
                  ),
                },
              }}
              label="BVN (Bank Verification Number)"
              placeholder="19392398293"
              className="mt-10"
              {...getTextFieldProps(formik, "nin")}
            />
            <FormHelperText>
              We use it only for verification and never share your data
            </FormHelperText>
          </div>
          <Divider />
          <div className="px-4 pb-4">
            <LoadingButton
              variant="gradient"
              type="submit"
              fullWidth
              // disabled={!formik.isValid || !formik.dirty}
              size="large"
              loading={formik.isSubmitting}
              loadingPosition="end"
              endIcon={<></>}
              className="my-5"
            >
              Continue
            </LoadingButton>

            <div className="flex items-center justify-center gap-2">
              <SecuredDataBadge />
            </div>
          </div>
        </form>
      ),
      verified: false,
      hasStepper: true,
    },
    {
      title: "Business Details",
      key: ONBOARDING_STEPS.BUSINESS,
      content: (
        <Fragment key={2}>
          <form onSubmit={formik.handleSubmit}>
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
            <div className="px-6 pt-4 pb-8">
              <Typography variant="h5" className="">
                What type of business do you own?{" "}
              </Typography>
              <Typography className=" text-neutral-500">
                Let’s confirm your business type to give you the best experience
              </Typography>

              <div className="grid grid-cols-1 gap-4 mt-6">
                {[
                  {
                    icon: "hugeicons:building-03",
                    title: "Business registered with CAC",
                    description: "You’ll need your CAC number to proceed",
                  },
                  {
                    icon: "solar:document-bold",
                    title: "Business not yet registered with CAC",
                    description: "You’ll provide a few details to continue",
                  },
                ].map(({ icon, title, description, ...rest }) => (
                  <CardActionArea
                    key={title}
                    {...rest}
                    className="flex gap-3 py-4 w-full  rounded-lg"
                  >
                    <Paper className="rounded-full bg-[#FFF3EE] border-1 border-[#FECBB9] p-3 w-fit">
                      <Icon
                        className="text-[#C53D0D]"
                        icon={icon}
                        width="24"
                        height="24"
                      />
                    </Paper>
                    <div className="flex-1">
                      <Typography className="font-medium text-neutral-900">
                        {title}
                      </Typography>
                      <Typography className="text-neutral-500 font-medium mt-2">
                        {description}
                      </Typography>
                    </div>
                    <Icon
                      icon="icon-park-outline:right"
                      width="24"
                      height="24"
                    />
                  </CardActionArea>
                ))}
              </div>
            </div>
          </form>
        </Fragment>
      ),
      verified: false,
      hasStepper: true,
    },
    {
      title: "Setup PIN",
      key: ONBOARDING_STEPS.PIN_SETUP,
      content: (
        <Fragment key={3}>
          <form onSubmit={formik.handleSubmit}>
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
            <div className="px-6 pt-4 pb-8">
              <Typography variant="h5" className="">
                What type of business do you own?{" "}
              </Typography>
              <Typography className=" text-neutral-500">
                Let’s confirm your business type to give you the best experience
              </Typography>

              <div className="grid grid-cols-1 gap-4 mt-6">
                {[
                  {
                    icon: "hugeicons:building-03",
                    title: "Business registered with CAC",
                    description: "You’ll need your CAC number to proceed",
                  },
                  {
                    icon: "solar:document-bold",
                    title: "Business not yet registered with CAC",
                    description: "You’ll provide a few details to continue",
                  },
                ].map(({ icon, title, description, ...rest }) => (
                  <CardActionArea
                    key={title}
                    {...rest}
                    className="flex gap-3 py-4 w-full  rounded-lg"
                  >
                    <Paper className="rounded-full bg-[#FFF3EE] border-1 border-[#FECBB9] p-3 w-fit">
                      <Icon
                        className="text-[#C53D0D]"
                        icon={icon}
                        width="24"
                        height="24"
                      />
                    </Paper>
                    <div className="flex-1">
                      <Typography className="font-medium text-neutral-900">
                        {title}
                      </Typography>
                      <Typography className="text-neutral-500 font-medium mt-2">
                        {description}
                      </Typography>
                    </div>
                    <Icon
                      icon="icon-park-outline:right"
                      width="24"
                      height="24"
                    />
                  </CardActionArea>
                ))}
              </div>
            </div>
          </form>
        </Fragment>
      ),
      verified: false,
      hasStepper: true,
    },
  ];

  const currentStep = steps.find((step) => step.key === stepper.step);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <Paper className="mt-5">
        <Stepper
          activeStep={stepper.step}
          connector={<CustomSVGConnector />}
          className="mb-5"
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {steps.map((step) => step.content)}
      </Paper>
    </div>
  );
}

export default DashboardAccountSetup;

export const Component = DashboardAccountSetup;

export const ONBOARDING_STEP_ = {
  NIN: 1,
  BVN: 2,
  BUSINESS: 3,
  PIN_SETUP: 4,
};

const CustomSVGConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 0,
    border: "none",
    margin: 0,
    padding: 0,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: -5,
      left: 0,
      width: "100%",
      height: 10,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12.5 18s6-4.419 6-6s-6-6-6-6m-7 12s6-4.419 6-6s-6-6-6-6' color='%23000'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 15px",
      zIndex: 1,
    },
  },
}));

const CustomStepIconRoot = styled("div")(() => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  margin: 5,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ active }} className={className}>
      {active && !completed ? (
        <Icon
          className="text-neutral-200 bg-black rounded-full"
          icon="fa:circle-o"
          width="24"
          height="24"
        />
      ) : (
        <>
          {completed ? (
            <Icon
              className="text-success-400"
              icon="lets-icons:check-fill"
              width="25"
              height="25"
            />
          ) : (
            <Icon
              className="text-neutral-200 bg-white rounded-full"
              icon="hugeicons:circle"
              width="24"
              height="24"
            />
          )}
        </>
      )}
    </CustomStepIconRoot>
  );
}
