import clsx from "clsx";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import useStepper from "hooks/use-stepper.ts";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useFormik } from "formik";
import { Button, Container } from "@mui/material";

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
import StepperConnector from "components/StepperConnector";
import StepperIcon from "components/StepperIcon";

function DashboardAccountSetup() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step") || {};

  const navigate = useNavigate();
  const stepper = useStepper({
    initialStep: Number(step) || 0,
  });

  const [userKyCMutation, userKyCMutationResult] = userApi.useUserKycMutation();
  const [verifyOtpMutation, verifyOtpMutationResult] =
    userApi.useVerifyUserOtpMutation();
  const [registerMerchantCacMutation, registerMerchantCacMutationResult] =
    merchantApi.useMerchantRegistrationCacMutation();
  const [userPinMutation] = userApi.useUserPinMutation();

  const formik = useFormik<DashboardAccountSetupFormikValues>({
    initialValues: {
      nin: "",
      bvn: "",
      otp: "",

      rcNumber: "",

      businessTypeId: "",
      businessName: "",
      annualTurnOver: "",
      businessSector: "",
      businessSectorParent: "",

      transactionPin: "",
      confirmTransactionPin: "",
    },
    validationSchema: yup.object({
      ...(() => {
        switch (stepper.step) {
          case ONBOARDING_STEPS.NIN:
            return {
              nin: yup.string().label("NIN").max(11),
            };
          case ONBOARDING_STEPS.NIN_VERIFICATION:
            return {
              otp: yup.string().label("Otp").max(6),
            };
          case ONBOARDING_STEPS.BVN:
            return {
              bvn: yup.string().label("BVN").max(11),
            };
          case ONBOARDING_STEPS.BVN_VERIFICATION:
            return {
              otp: yup.string().label("Otp").max(6),
            };
          case ONBOARDING_STEPS.BUSINESS:
            return {};
          case ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION:
            return {
              rcNumber: yup.string().label("RC Number"),
            };
          case ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_VERIFICATION:
            return {
              otp: yup.string().label("Otp").max(6),
            };
          case ONBOARDING_STEPS.BUSINESS_NON_CAC_REGISTRATION:
            return {
              businessTypeId: yup.string().label("Business Type").required(),
              annualTurnOver: yup.string().label("Annual Turn Over"),
              businessSector: yup
                .string()
                .label("Business Sector Subcategory")
                .required(),
              businessSectorParent: yup
                .string()
                .label("Business Sector")
                .required(),
            };
          case ONBOARDING_STEPS.PIN_SETUP:
            return {
              transactionPin: yup.string().label("Pin").max(6),
            };
          case ONBOARDING_STEPS.PIN_SETUP_VERIFICATION:
            return {
              confirmTransactionPin: yup.string().label("Pin").max(6),
            };
          default:
            return {};
        }
      })(),
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
            stepper.go(ONBOARDING_STEPS.NIN_PREVIEW);
            formik.setFieldValue("otp", "");
            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.NIN_PREVIEW: {
            stepper.go(ONBOARDING_STEPS.BVN);
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
            stepper.go(ONBOARDING_STEPS.BVN_PREVIEW);
            formik.setFieldValue("otp", "");
            break;
          }
          case ONBOARDING_STEPS.BVN_PREVIEW: {
            stepper.go(ONBOARDING_STEPS.BUSINESS);
            break;
          }
          case ONBOARDING_STEPS.BUSINESS_NON_CAC_REGISTRATION: {
            stepper.go(ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION);
            break;
          }
          case ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION: {
            const resp = await registerMerchantCacMutation({
              body: {
                rcNumber: values.rcNumber,
                businessType: Number(values.businessTypeId),
                businessSector: Number(values.businessSectorParent),
                businessSubSector: Number(values.businessSector),
                ...(values.annualTurnOver && {
                  annualTurnOver: Number(values.annualTurnOver),
                }),
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

            stepper.go(ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_PREVIEW);
            formik.setFieldValue("otp", "");
            enqueueSnackbar(resp?.message || "Successful!", {
              variant: "success",
            });
            break;
          }
          case ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_PREVIEW: {
            stepper.go(ONBOARDING_STEPS.PIN_SETUP);
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
      title: "NIN Preview",
      tab: ONBOARDING_STEPS.NIN_PREVIEW,
      parentTab: ONBOARDING_STEPS.NIN,
      parent: false,
      content: (
        <DashboardAccountSetupNin
          previewInfo={verifyOtpMutationResult?.data?.data?.nin}
          {...contentProps}
        />
      ),
      verified: true,
      hasStepper: true,
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
      title: "BVN Preview",
      tab: ONBOARDING_STEPS.BVN_PREVIEW,
      parentTab: ONBOARDING_STEPS.BVN,
      parent: false,
      content: (
        <DashboardAccountSetupBvn
          previewInfo={verifyOtpMutationResult?.data?.data?.bvn}
          {...contentProps}
        />
      ),
      hasStepper: true,
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
      title: "Business NON CAC Registration",
      tab: ONBOARDING_STEPS.BUSINESS_NON_CAC_REGISTRATION,
      parentTab: ONBOARDING_STEPS.BUSINESS,
      parent: false,
      content: <DashboardAccountSetupBusinessNonCacReg {...contentProps} />,
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
      title: "Business CAC Verification",
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
      title: "Business CAC Registration Preview",
      tab: ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION_PREVIEW,
      parentTab: ONBOARDING_STEPS.BUSINESS,
      parent: false,
      content: (
        <DashboardAccountSetupBusinessCacReg
          previewInfo={verifyOtpMutationResult?.data?.data?.business}
          {...contentProps}
        />
      ),
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
    <Container className="relative lg:block flex flex-col">
      <div className="mt-18 mx-auto">
        <Stepper
          activeStep={parentStepIndex}
          connector={<StepperConnector />}
          className={clsx(
            "mb-5 max-w-[600px] mx-auto",
            currentStep?.hasStepper ? "visible" : "invisible"
          )}
        >
          {parentSteps.map(({ title }) => (
            <Step key={title}>
              <StepLabel StepIconComponent={StepperIcon}>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="mt-5">{currentStep?.content}</div>
      </div>
      {![ONBOARDING_STEPS.ACCOUNT_SETUP_COMPLETED].includes(stepper.step) && (
        <Button
          variant="outlined"
          color="inherit"
          className="absolute top-3 right-3 border border-neutral-300"
          onClick={() => {
            navigate(DASHBOARD);
          }}
        >
          Save & continue later
        </Button>
      )}
    </Container>
  );
}

export default DashboardAccountSetup;

export const Component = DashboardAccountSetup;
