/* eslint-disable react-refresh/only-export-components */
import store from "configs/store";
import AppProtectedHeader from "./AppProtectedHeader";
import AppProtectedDrawer from "./AppProtectedDrawer";
import { Outlet, redirect } from "react-router-dom";
import { SIGNIN } from "constants/urls";
import { Container } from "@mui/material";
import LoadingContent from "components/LoadingContent";
import useAuthUser from "hooks/use-auth-user";
import AuthRefreshTokenDialog from "modules/auth/features/AuthRefreshTokenDialog";
import { useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import useToggle from "hooks/use-toggle";
import useLogout from "hooks/use-logout";
import { userApi } from "apis/user.ts";

function AppProtected() {
  const { logout } = useLogout();

  const userQueryResult = userApi.useGetUserQuery(undefined);

  const [
    isRefreshTokenDialog,
    toggleRefreshTokenDialog,
    setRefreshTokenDialog,
  ] = useToggle();

  const authUser = useAuthUser();

  useEffect(() => {
    const timer = setInterval(() => {
      if (authUser?.expiresIn) {
        const differenceInExpiration = differenceInSeconds(
          new Date(authUser?.expiresIn),
          new Date()
        );

        if (differenceInExpiration <= 30) {
          setRefreshTokenDialog(true);
        }

        if (differenceInExpiration <= 0) {
          logout();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <LoadingContent
      fullHeight
      loading={userQueryResult.isLoading}
      error={userQueryResult.isError}
      onRetry={userQueryResult.refetch}
    >
      {() => (
        <>
          <AppProtectedDrawer />
          <AppProtectedHeader />
          <div className="lg:ml-[270px]">
            <Container className="p-4 md:p-8">{<Outlet />}</Container>
          </div>
          {isRefreshTokenDialog && (
            <AuthRefreshTokenDialog
              open={isRefreshTokenDialog}
              onClose={toggleRefreshTokenDialog}
            />
          )}
        </>
      )}
    </LoadingContent>
  );
}

export default AppProtected;

export const Component = AppProtected;

export function loader() {
  const { authUser } = store.getState().global;

  if (!authUser?.isAuthenticated) {
    return redirect(SIGNIN);
  }

  return null;
}
