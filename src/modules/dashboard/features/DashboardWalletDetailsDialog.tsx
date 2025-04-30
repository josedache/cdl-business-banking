import { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import useToggle from "hooks/use-toggle.ts";

import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import { walletApi } from "apis/wallet";
import useAuthUser from "hooks/use-auth-user";
import { merchantApi } from "apis/merchant";
import useClipboard from "hooks/use-clipboard";

function DashboardWalletDetailsDialog(
  props: DashboardWalletDetailsDialogProps
) {
  const { children, onClose, ...restProps } = props;

  const [isOpen, toggleOpen, setOpen] = useToggle();
  const { writeText } = useClipboard();

  const authUser = useAuthUser();

  const getBusinessNameQuery = merchantApi.useGetMerchantBusinessProfileQuery(
    {
      params: {
        rcNumber: authUser?.info?.businesses?.[0]?.rcNumber,
      },
    },
    { skip: !authUser?.info?.businesses?.[0]?.rcNumber }
  );

  const businessName = getBusinessNameQuery.data?.data?.business?.name;

  function handleClose(e?: any, reason?: any) {
    onClose?.(e, reason);
    setOpen(false);
  }

  const transferWalletsQueryResult = walletApi.useGetWalletsQuery({});
  const transferWallets = transferWalletsQueryResult.data?.data;

  const mainWallet = transferWallets?.find((wallet) => !!wallet?.groupId);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "500px",
            },
          },
        }}
        fullWidth
        {...restProps}
      >
        <DialogTitleXCloseButton onClose={handleClose}>
          Wallet Details
        </DialogTitleXCloseButton>
        <Divider />
        <DialogContent className="py-6 px-6">
          <Paper elevation={0} className="px-6 py-4 bg-[#F4F5F5] ">
            <Typography
              variant="body2"
              className="text-neutral-500 text-center"
            >
              Your account Number
            </Typography>
            <Typography variant="h4" className="font-semibold text-center">
              {transferWalletsQueryResult?.isLoading ? (
                <Skeleton
                  variant="text"
                  className="w-full max-w-[200px] max-h-[37px]"
                />
              ) : (
                <span>
                  {mainWallet?.accountNumber || ""}
                  <IconButton
                    onClick={() => {
                      writeText(mainWallet?.accountNumber);
                    }}
                  >
                    <Icon icon="hugeicons:copy-01" />
                  </IconButton>
                </span>
              )}
            </Typography>
            <div>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {[
                  {
                    title: "Account Name",
                    value: businessName || "",
                    copy: true,
                  },
                  {
                    title: "Bank Name",
                    value: "Credit Direct Limited",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-2 justify-between items-center"
                  >
                    <Typography variant="body2" className="text-neutral-600">
                      {item.title}
                    </Typography>
                    {getBusinessNameQuery?.isLoading ? (
                      <Skeleton variant="text" width="100px" height="24px" />
                    ) : (
                      <Typography noWrap>
                        {item.value}
                        {item?.copy ? (
                          <IconButton
                            onClick={() => {
                              writeText(item.value);
                            }}
                          >
                            <Icon
                              icon="hugeicons:copy-01"
                              width={15}
                              height={15}
                            />
                          </IconButton>
                        ) : null}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Paper>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button variant="gradient" size="large" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {typeof children === "function"
        ? children({ isOpen, toggleOpen, setOpen })
        : children}
    </>
  );
}

export default DashboardWalletDetailsDialog;

export type DashboardWalletDetailsDialogProps = {
  open?: boolean;
  children?:
    | ReactNode
    | ((props: {
        isOpen: boolean;
        toggleOpen: () => void;
        setOpen: (p: any) => void;
      }) => any);
} & Omit<DialogProps, "children" | "open" | "id">;
