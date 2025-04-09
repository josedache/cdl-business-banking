import clsx from "clsx";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import useStepper from "hooks/use-stepper.ts";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { useFormik } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Container } from "@mui/material";

import { ONBOARDING_STEPS } from "../enums/onboardingStepsEnum";
import { DASHBOARD } from "constants/urls";
import { userApi } from "apis/user.ts";
import { merchantApi } from "apis/merchant";
import DashboardAccountSetupNin from "../features/DashboardAccountSetupNin";
import DashboardAccountSetupNinVerification from "../features/DashboardAccountSetupNinVerification";
import DashboardAccountSetupBvn from "../features/DashboardAccountSetupBvn";
import DashboardAccountSetupBvnVerification from "../features/DashboardAccountSetupBvnVerification";
import DashboardAccountSetupBusiness from "../features/DashboardAccountSetupBusiness";
import DashboardAccountSetupBusinessCacReg from "../features/DashboardAccountSetupBusinessCacReg";
import DashboardAccountSetupBusinessCacRegVerification from "../features/DashboardAccountSetupBusinessCacRegVerification";
import DashboardAccountSetupPinSetupVerification from "../features/DashboardAccountSetupPinSetupVerification";
import DashboardAccountSetupPinSetupCompleted from "../features/DashboardAccountSetupPinSetupCompleted";
import { DashboardAccountSetupFormikValues } from "../types/DashboardStepForm";
import DashboardAccountSetupBusinessNonCacReg from "../features/DashboardAccountSetupBusinessNonCacReg";
import DashboardAccountSetupPinSetup from "../features/DashboardAccountSetupPinSetup";

function DashboardAccountSetup() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step") || {};

  const navigate = useNavigate();
  const stepper = useStepper({
    initialStep: Number(step) || 0,
  });

  const [userKyCMutation, userKyCMutationResult] = userApi.useUserKycMutation();
  const [verifyOtpMutation] = userApi.useVerifyUserOtpMutation();
  const [registerMerchantCacMutation, registerMerchantCacMutationResult] =
    merchantApi.useMerchantRegistrationCacMutation();
  const [registerMerchantNonCacMutation] =
    merchantApi.useMerchantRegistrationNonCacMutation();
  const [userPinMutation] = userApi.useUserPinMutation();

  const formik = useFormik<DashboardAccountSetupFormikValues>({
    initialValues: {
      nin: "",
      bvn: "",
      otp: "",

      rcNumber: "",

      businessType: "",
      businessName: "",
      annualTurnOver: "",
      businessSector: "",
      businessSectorParent: "",

      transactionPin: "",
      confirmTransactionPin: "",
    },
    validationSchema: yup.object({
      ...[
        {
          nin: yup.string().label("NIN").max(11),
        },
        {
          otp: yup.string().label("Otp").max(6),
        },
        {
          bvn: yup.string().label("BVN").max(11),
        },
        {
          otp: yup.string().label("Otp").max(6),
        },
        {},
        {
          rcNumber: yup.string().label("RC Number"),
        },
        {
          otp: yup.string().label("Otp").max(6),
        },
        {
          businessType: yup.string().label("Business Type").required(),
          businessName: yup.string().label("Business Name").required(),
          annualTurnOver: yup.string().label("Annual Turn Over"),
          businessSector: yup
            .string()
            .label("Business Sector Subcategory")
            .required(),
          businessSectorParent: yup
            .string()
            .label("Business Sector")
            .required(),
        },
        {
          transactionPin: yup.string().label("Pin").max(6),
        },
        {
          confirmTransactionPin: yup.string().label("Pin").max(6),
        },
        {},
      ][stepper.step],
    }),
    onSubmit: async (values) => {
      try {
        switch (stepper.step) {
          case ONBOARDING_STEPS.NIN: {
            const resp = await userKyCMutation({
              body: {
                nin: values.nin,
              },
            }).unwrap();

            if (resp?.statusCode === 200) {
              // NIN and BVN exist on CBA
              stepper.go(ONBOARDING_STEPS.BUSINESS);
            }
            if (resp?.statusCode === 201) {
              // Newly created NIN
              stepper.go(ONBOARDING_STEPS.NIN_VERIFICATION);
            }
            if (resp?.statusCode === 202) {
              // NIN exists on CBA but BVN does not
              stepper.go(ONBOARDING_STEPS.BVN);
            }
            if (resp?.statusCode === 409) {
              // Incomplete NIN registration
              stepper.go(ONBOARDING_STEPS.NIN_VERIFICATION);
            }

            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.NIN_VERIFICATION: {
            const resp = await verifyOtpMutation({
              body: {
                reason: "verify_nin",
                otp: values.otp,
              },
            }).unwrap();
            stepper.go(ONBOARDING_STEPS.BVN);
            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.BVN: {
            const resp = await userKyCMutation({
              body: {
                bvn: values.bvn,
              },
            }).unwrap();

            if (resp?.statusCode === 200) {
              stepper.go(ONBOARDING_STEPS.BUSINESS);
            }
            if (resp?.statusCode === 201) {
              stepper.go(ONBOARDING_STEPS.BVN_VERIFICATION);
            }
            if (resp?.statusCode === 202) {
              stepper.go(ONBOARDING_STEPS.BUSINESS);
            }
            if (resp?.statusCode === 409) {
              stepper.go(ONBOARDING_STEPS.BVN_VERIFICATION);
            }

            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.BVN_VERIFICATION: {
            await verifyOtpMutation({
              body: {
                reason: "verify_bvn",
                otp: values.otp,
              },
            }).unwrap();
            stepper.go(ONBOARDING_STEPS.BUSINESS);
            break;
          }
          case ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION: {
            const resp = await registerMerchantCacMutation({
              params: {
                rcNumber: values.rcNumber,
              },
            }).unwrap();

            if (resp?.statusCode === 200) {
              stepper.go(ONBOARDING_STEPS.PIN_SETUP);
            }
            if (resp?.statusCode === 201) {
              stepper.go(
                ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_VERIFICATION
              );
            }

            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_VERIFICATION: {
            if (!values.rcNumber) {
              stepper.go(ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION);
            }
            const resp = await verifyOtpMutation({
              body: {
                reason: "verify_business",
                otp: values.otp,
                rcNumber: values.rcNumber,
              },
            }).unwrap();

            stepper.go(ONBOARDING_STEPS.PIN_SETUP);

            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.BUSINESS_NON_CAC_REGISTRATION: {
            const resp = await registerMerchantNonCacMutation({
              body: {
                businessType: values.businessType,
                businessName: values.businessName,
                annualTurnOver: values.annualTurnOver,
                businessSector: values.businessSector,
              },
            }).unwrap();
            stepper.go(ONBOARDING_STEPS.PIN_SETUP);
            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.PIN_SETUP: {
            const resp = await userPinMutation({
              body: {
                pin: values.transactionPin,
              },
              params: {
                action: "create",
              },
            }).unwrap();
            stepper.go(ONBOARDING_STEPS.PIN_SETUP_VERIFICATION);
            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.PIN_SETUP_VERIFICATION: {
            const resp = await userPinMutation({
              body: {
                pin: values.transactionPin,
              },
              params: {
                action: "confirm",
              },
            }).unwrap();
            stepper.go(ONBOARDING_STEPS.ACCOUNT_SETUP_COMPLETED);
            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.ACCOUNT_SETUP_COMPLETED: {
            navigate(DASHBOARD);
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

  const contentProps = { formik, stepper };

  const steps = [
    {
      title: "Provide NIN",
      tab: ONBOARDING_STEPS.NIN,
      parentTab: ONBOARDING_STEPS.NIN,
      parent: true,
      content: <DashboardAccountSetupNin {...contentProps} />,
      verified: true,
      hasStepper: true,
    },
    {
      title: "Verify NIN",
      tab: ONBOARDING_STEPS.NIN_VERIFICATION,
      parentTab: ONBOARDING_STEPS.NIN,
      content: (
        <DashboardAccountSetupNinVerification
          {...contentProps}
          phone={userKyCMutationResult?.data?.data?.phone}
          expiration={userKyCMutationResult?.data?.data?.expiry || 0}
        />
      ),
      hasStepper: false,
    },
    {
      title: "Provide BVN",
      tab: ONBOARDING_STEPS.BVN,
      parentTab: ONBOARDING_STEPS.BVN,
      parent: true,
      content: <DashboardAccountSetupBvn {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Verify BVN",
      tab: ONBOARDING_STEPS.BVN_VERIFICATION,
      parentTab: ONBOARDING_STEPS.BVN,
      content: (
        <DashboardAccountSetupBvnVerification
          {...contentProps}
          phone={userKyCMutationResult?.data?.data?.phone}
          expiration={userKyCMutationResult?.data?.data?.expiry || 0}
        />
      ),
      hasStepper: false,
    },
    {
      title: "Business Details",
      tab: ONBOARDING_STEPS.BUSINESS,
      parentTab: ONBOARDING_STEPS.BUSINESS,
      parent: true,
      content: <DashboardAccountSetupBusiness {...contentProps} />,
      hasStepper: true,
    },

    {
      title: "Business CAC Registration",
      tab: ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION,
      parentTab: ONBOARDING_STEPS.BUSINESS,
      parent: false,
      content: <DashboardAccountSetupBusinessCacReg {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Verify Business CAC Registration",
      tab: ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_VERIFICATION,
      parentTab: ONBOARDING_STEPS.BUSINESS,
      parent: false,
      content: (
        <DashboardAccountSetupBusinessCacRegVerification
          {...contentProps}
          phone={registerMerchantCacMutationResult?.data?.data?.phone || ""}
          expiration={
            registerMerchantCacMutationResult?.data?.data?.expiry || 0
          }
        />
      ),
      hasStepper: false,
    },
    {
      title: "Business NON CAC Registration",
      tab: ONBOARDING_STEPS.BUSINESS_NON_CAC_REGISTRATION,
      parentTab: ONBOARDING_STEPS.BUSINESS,
      parent: false,
      content: <DashboardAccountSetupBusinessNonCacReg {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Setup PIN",
      tab: ONBOARDING_STEPS.PIN_SETUP,
      parentTab: ONBOARDING_STEPS.PIN_SETUP,
      parent: true,
      content: <DashboardAccountSetupPinSetup {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Setup PIN Verification",
      tab: ONBOARDING_STEPS.PIN_SETUP_VERIFICATION,
      parentTab: ONBOARDING_STEPS.PIN_SETUP,
      parent: false,
      content: <DashboardAccountSetupPinSetupVerification {...contentProps} />,
      hasStepper: true,
    },
    {
      title: "Account Setup Completed",
      tab: ONBOARDING_STEPS.ACCOUNT_SETUP_COMPLETED,
      parentTab: ONBOARDING_STEPS.PIN_SETUP,
      parent: false,
      content: <DashboardAccountSetupPinSetupCompleted {...contentProps} />,
      hasStepper: false,
    },
  ];

  const currentStep = steps[stepper.step];
  const parentSteps = steps.filter((step) => step.parent === true);
  const parentStepIndex = parentSteps?.findIndex(
    (step) => step?.tab === currentStep?.parentTab
  );

  return (
    <Container className="mt-18 mx-auto">
      <Stepper
        activeStep={parentStepIndex}
        connector={<CustomSVGConnector />}
        className={clsx(
          "mb-5 max-w-[600px] mx-auto",
          currentStep?.hasStepper ? "visible" : "invisible"
        )}
      >
        {parentSteps.map(({ title }) => (
          <Step key={title}>
            <StepLabel StepIconComponent={QontoStepIcon}>{title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="mt-5">{currentStep?.content}</div>
    </Container>
  );
}

export default DashboardAccountSetup;

export const Component = DashboardAccountSetup;

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
              className="text-[#0E8950]"
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
