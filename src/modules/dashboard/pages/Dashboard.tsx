import {
  Button,
  Card,
  CardActionArea,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CircularProgressWithLabel from "components/CircularProgress";
import SetUpBgImg from "assets/imgs/setup-bg.png";
import WalletBgImg from "assets/imgs/wallet-bg.png";

import { Icon } from "@iconify/react/dist/iconify.js";
import CurrencyTypography from "components/CurrencyTypography";
import useToggle from "hooks/use-toggle";
import DashboardAccountSetupDialog from "../features/DashboardAccountSetupDialog";
import useAuthUser from "hooks/use-auth-user";
import isKycCheckCompleted from "utils/function/is-kyc-check-completed";
import getKycVerificationPercentage from "utils/function/get-kyc-verification-percentage";

function Dashboard() {
  const [isBlurWalletBalance, toggleIsBurWaller] = useToggle();
  const user = useAuthUser();

  const isKycCompleted = isKycCheckCompleted(user?.info);
  const verificationPercentage = getKycVerificationPercentage(user?.info);

  const [isAccountSetup, toggleAccountSetup] = useToggle(!isKycCompleted);

  const businessName = user?.info?.businesses?.[0]?.name;

  return (
    <>
      <Typography className="font-semibold capitalize" noWrap variant="h4">
        Welcome, {businessName}
      </Typography>

      {!isKycCompleted ? (
        <Card
          elevation={0}
          sx={{
            backgroundImage: `url(${SetUpBgImg}), linear-gradient(112deg, #353D4A 40.01%, #737882 92.86%)`,
            backgroundPosition: "right center",
            backgroundOrigin: "border-box",
            backgroundRepeat: "no-repeat",
            backgroundSize: "",
            borderRadius: "16px",
          }}
          className="flex flex-wrap items-center gap-4 p-6 mt-6"
        >
          <div>
            <CircularProgressWithLabel value={verificationPercentage || 0} />
          </div>
          <div className="flex justify-between items-center gap-4 flex-wrap flex-1">
            <div>
              <Typography variant="h5" className="font-semibold text-white">
                Finish Setting Up Your Account
              </Typography>
              <Typography className="text-white max-w-[407px]">
                Complete your profile to start carrying out transactions. Just 4
                steps left to unlock full features—takes less than 5 minutes!
              </Typography>
            </div>

            <div>
              <Button onClick={toggleAccountSetup} size="large">
                Unlock Full Access
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card
        elevation={0}
        className="mt-6 p-6"
        sx={{
          backgroundImage: `url(${WalletBgImg}), linear-gradient(124deg, #96324A -7.26%, #FF6731 64.16%, #EFC531 122.07%)`,
          backgroundPosition: "top center",
          backgroundOrigin: "border-box",
          backgroundRepeat: "repeat-x",
          backgroundSize: "",
          borderRadius: "16px",
          ...(isKycCompleted ? { opacity: 1 } : { opacity: 0.2 }),
        }}
      >
        <div className="flex gap-5 justify-between flex-wrap">
          <Typography variant="h5" className="font-semibold text-white">
            Wallet summary
          </Typography>

          <div className="inline-flex gap-4">
            <CardActionArea
              disabled={!isKycCompleted}
              className="inline-flex bg-white rounded-lg px-4 gap-1 items-center py-[6px]"
            >
              <Icon
                icon="hugeicons:filter-mail-square"
                width="24"
                height="24"
              />

              <Typography className="font-semibold">Today</Typography>
            </CardActionArea>

            <CardActionArea
              onClick={toggleIsBurWaller}
              disabled={!isKycCompleted}
              className="p-[6px] bg-white rounded-lg"
            >
              <Icon
                icon={
                  isBlurWalletBalance ? "solar:eye-outline" : "bi:eye-slash"
                }
                width="24"
                height="24"
              />
            </CardActionArea>
          </div>
        </div>

        <Paper elevation={0} elevation={0} className="bg-[#F8F9FB] mt-6">
          <div className="px-4 pt-4">
            <Typography className="font-semibold text-[#686A71]">
              Main wallet balance
            </Typography>
            <CurrencyTypography
              variant="h2"
              className="font-semibold mt-4"
              blur={isBlurWalletBalance}
            >
              0.0
            </CurrencyTypography>
            <Typography className="font-semibold mt-1">4.0% PA</Typography>
          </div>
          <Divider className="mt-4" />

          <div className="p-4 flex gap-4 flex-wrap">
            <div className="inline-flex gap-3 flex-col justify-center items-center ">
              <IconButton
                variant="contained"
                className="rounded-lg w-fit text-white"
                disabled={!isKycCompleted}
                sx={{
                  background:
                    "linear-gradient(180deg, #EFC531 0%, #FF7849 100%)",
                }}
              >
                <div>
                  <Icon
                    icon="hugeicons:money-exchange-03"
                    width="24"
                    height="24"
                  />
                </div>
              </IconButton>
              <Typography>Transfer funds</Typography>
            </div>

            <div className="inline-flex flex-col justify-center gap-3 items-center ">
              <IconButton
                disabled={!isKycCompleted}
                variant="outlined"
                className="rounded-lg w-fit "
              >
                <Icon
                  icon="hugeicons:more-horizontal-circle-01"
                  width="24"
                  height="24"
                />
              </IconButton>
              <Typography>Wallet Details</Typography>
            </div>
          </div>
        </Paper>
      </Card>

      {isAccountSetup && (
        <DashboardAccountSetupDialog
          open={isAccountSetup}
          onClose={toggleAccountSetup}
        />
      )}
    </>
  );
}

export default Dashboard;

export const Component = Dashboard;
