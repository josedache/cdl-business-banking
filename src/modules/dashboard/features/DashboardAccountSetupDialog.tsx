import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogProps,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import CircularProgressWithLabel from "components/CircularProgress";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_SETUP } from "constants/urls";
import useAuthUser from "hooks/use-auth-user";
import getKycVerificationPercentage from "utils/function/get-kyc-verification-percentage";
import { ONBOARDING_STEPS } from "../enums/onboardingStepsEnum";

type DashboardAccountSetupDialogProps = {
  open: true;
  onClose: () => void;
} & Omit<DialogProps, "children">;
export default function DashboardAccountSetupDialog(
  props: DashboardAccountSetupDialogProps
) {
  const { onClose, ...rest } = props;
  const navigate = useNavigate();
  const user = useAuthUser();

  const verificationPercentage = getKycVerificationPercentage(user?.info);

  const steps = [
    {
      title: "Email verified",
      verified: user?.info?.isEmailVerified || false,
    },
    {
      title: "Provide NIN ",
      description: "Required to verify your identity",
      verified: user?.info?.isNinVerified || false,
      step: ONBOARDING_STEPS.NIN,
    },
    {
      title: "Provide BVN ",
      description: "Required to unlock transactions",
      verified: user?.info?.isBvnVerified || false,
      step: ONBOARDING_STEPS.BVN,
    },
    {
      title: "Provide Business Details",
      description: "Required to personalize your experience",
      verified: user?.info?.businesses?.[0]?.is_validated || false,
      step: ONBOARDING_STEPS.BUSINESS,
    },
    {
      title: "Setup Transaction PIN",
      description: "Required to secure your transactions",
      verified: user?.info?.transactionPin?.[0]?.is_active || false,
      step: ONBOARDING_STEPS.PIN_SETUP,
    },
  ];

  const firstUnverifiedStep = steps?.find((step) => !step?.verified)?.step;

  return (
    <Dialog
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "520px", // Set your width here
          },
        },
      }}
      {...rest}
    >
      <DialogTitleXCloseButton onClose={onClose}></DialogTitleXCloseButton>
      <DialogContent>
        <div className="flex justify-center mt-5">
          <div className="bg-[#12B76A] border-6 border-[#DBF4E9] w-16 h-16 rounded-full flex items-center justify-center">
            <Icon
              icon="charm:tick"
              width="35"
              stroke="100"
              height="35"
              className="text-white"
            />
          </div>
        </div>

        <Typography variant="h5" className="text-center font-semibold mt-2">
          Profile Created Successfully!
        </Typography>
        <Typography variant="body2" className="text-center mt-1">
          Welcome aboard! You’re now ready to set up your account for full
          access
        </Typography>

        <Card
          elevation={0}
          className="mt-6 p-4"
          sx={{
            background: `linear-gradient(112deg, #353D4A 40.01%, #737882 92.86%), #F6F8FB;`,
          }}
        >
          <div className="flex justify-between">
            <div>
              <Typography variant="h6" className="font-semibold text-white">
                Finish Setting Up Your Account
              </Typography>
              <Typography variant="body2" className="text-white mt-1">
                Just 4 steps left to unlock full features—takes less than 5
                minutes!
              </Typography>
            </div>

            <CircularProgressWithLabel value={verificationPercentage || 0} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4">
            {steps.map((step) => (
              <div className="flex gap-2">
                {step.verified ? (
                  <Icon
                    className="text-success-300"
                    icon="hugeicons:checkmark-circle-02"
                    width="20"
                    height="20"
                  />
                ) : (
                  <Icon
                    className="text-neutral-500"
                    icon="hugeicons:circle"
                    width="20"
                    height="20"
                  />
                )}
                <div>
                  <Typography
                    className={clsx(
                      step.verified
                        ? "text-neutral-300 line-through"
                        : "text-neutral-50",
                      "font-semibold"
                    )}
                  >
                    {step.title}
                  </Typography>
                  <Typography className="text-neutral-300 mt-1">
                    {step.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              navigate(ACCOUNT_SETUP + `?step=${firstUnverifiedStep}`);
            }}
            fullWidth
            className="mt-4"
          >
            Finish Setup
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
