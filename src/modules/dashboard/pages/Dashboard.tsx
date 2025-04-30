import {
  Button,
  Card,
  CardActionArea,
  Divider,
  IconButton,
  Paper,
  Skeleton,
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
import { useNavigate } from "react-router-dom";
import { TRANSFER } from "constants/urls";
import DashboardTransactionList from "modules/dashboard/features/DashboardTransactionList.tsx";
import { walletApi } from "apis/wallet";
import { merchantApi } from "apis/merchant";
import useClipboard from "hooks/use-clipboard";
import DashboardWalletDetailsDialog from "../features/DashboardWalletDetailsDialog";

function Dashboard() {
  const [isBlurWalletBalance, toggleIsBurWaller] = useToggle(true);
  const user = useAuthUser();
  const navigate = useNavigate();
  const { writeText } = useClipboard();

  const isKycCompleted = isKycCheckCompleted(user?.info);
  const verificationPercentage = getKycVerificationPercentage(user?.info);

  const [isAccountSetup, toggleAccountSetup] = useToggle(!isKycCompleted);

  const getBusinessInfoQuery = merchantApi.useGetMerchantBusinessProfileQuery({
    params: {
      rcNumber: user?.info?.businesses?.[0]?.rcNumber,
    },
  });

  const businessName = getBusinessInfoQuery?.data?.data?.business?.name || "";

  const transferWalletsQueryResult = walletApi.useGetWalletsQuery({});
  const transferWallets = transferWalletsQueryResult.data?.data;

  const mainWallet = transferWallets?.find((wallet) => !!wallet?.groupId);

  return (
    <>
      <Typography className="font-semibold capitalize" noWrap variant="h4">
        {businessName ? `Welcome, ${businessName}` : "Welcome"}
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
              <Button
                onClick={toggleAccountSetup}
                variant="gradient"
                size="large"
              >
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

        <Paper elevation={0} className="bg-[#F8F9FB] mt-6">
          <div className="px-4 pt-4">
            <div className="flex justify-between gap-2 flex-wrap items-center">
              <Typography className="font-medium text-[#686A71]">
                Main wallet balance
              </Typography>

              <Paper
                className="flex items-center gap-2 p-[8px] rounded-lg bg-[#F8F9FB] border border-[#EDEFF2]"
                elevation={0}
              >
                <IconButton
                  disabled={
                    transferWalletsQueryResult?.isLoading ||
                    !mainWallet?.accountNumber
                  }
                  onClick={() => writeText(mainWallet?.accountNumber || "")}
                  className="p-0"
                >
                  <Icon icon="hugeicons:copy-01" width="18" height="18" />
                </IconButton>
                {transferWalletsQueryResult?.isLoading ? (
                  <Skeleton variant="text" width="100px" height="24px" />
                ) : (
                  <Typography>{mainWallet?.accountNumber}</Typography>
                )}
              </Paper>
            </div>

            <div className="mt-4">
              {transferWalletsQueryResult?.isLoading ? (
                <Skeleton
                  className="w-full md:h-[60px] h-[40px] max-w-[200px]"
                  sx={{ fontSize: "4rem" }}
                />
              ) : (
                <CurrencyTypography
                  variant="h2"
                  className="font-semibold overflow-auto scrollbar-hidden"
                  blur={isBlurWalletBalance}
                >
                  {mainWallet?.accountBalance}
                </CurrencyTypography>
              )}

              <Typography className="font-semibold mt-1">4.0% PA</Typography>
            </div>
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
                onClick={() => navigate(TRANSFER)}
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
              <DashboardWalletDetailsDialog>
                {({ toggleOpen }) => (
                  <IconButton
                    disabled={!isKycCompleted}
                    variant="outlined"
                    onClick={toggleOpen}
                    className="rounded-lg w-fit "
                  >
                    <Icon
                      icon="hugeicons:more-horizontal-circle-01"
                      width="24"
                      height="24"
                    />
                  </IconButton>
                )}
              </DashboardWalletDetailsDialog>

              <Typography>Wallet Details</Typography>
            </div>
          </div>
        </Paper>
      </Card>

      <div className="mt-4">
        <DashboardTransactionList />
      </div>

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
