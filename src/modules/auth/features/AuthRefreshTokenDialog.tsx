import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { differenceInSeconds } from "date-fns";
import useAuthUser from "hooks/use-auth-user";
import useLogout from "hooks/use-logout";

import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

type AuthRefreshTokenDialogProps = {
  onClose: () => void;
} & DialogProps;

export default function AuthRefreshTokenDialog(
  props: AuthRefreshTokenDialogProps
) {
  const { onClose, ...rest } = props;
  const user = useAuthUser();
  const { logout } = useLogout();
  const [counter, setCounter] = useState(
    differenceInSeconds(new Date(user.expiresIn), new Date())
  );
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (counter === 0) {
      logout();
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  });

  // const [refreshTokenMutation, refreshTokenMutationResult] =
  //   userApi.useUserRefreshTokenMutation();

  const handleRefreshToken = async () => {
    try {
      // await refreshTokenMutation({
      //   body: {
      //     user_id: user.id,
      //     token: user.refreshToken,
      //   },
      // }).unwrap();
      enqueueSnackbar("Session Refreshed", { variant: "success" });
      onClose();
    } catch (error) {
      enqueueSnackbar(
        Array.isArray(error?.data?.message)
          ? error?.data?.message?.[0]
          : error?.data?.message || "Failed to refresh token",
        { variant: "error" }
      );
    }
  };

  return (
    <Dialog {...rest} maxWidth="xs" fullWidth>
      <DialogTitle>Session Expired</DialogTitle>

      <DialogContent>
        You'll be logged out in the next <b>{counter}s</b>
      </DialogContent>

      <DialogActions>
        <Button onClick={logout} variant="soft" color="error">
          Logout
        </Button>
        <LoadingButton
          // loading={refreshTokenMutationResult?.isLoading}
          variant="soft"
          color="success"
          onClick={handleRefreshToken}
        >
          Continue Session
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
