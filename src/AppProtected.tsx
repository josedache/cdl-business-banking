/* eslint-disable react-refresh/only-export-components */
import clsx from "clsx";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import { useEffect } from "react";
import { differenceInSeconds } from "date-fns";

import LoadingContent from "components/LoadingContent";
import useAuthUser from "hooks/use-auth-user";
import AuthRefreshTokenDialog from "modules/auth/features/AuthRefreshTokenDialog";
import AppProtectedHeader from "./AppProtectedHeader";
import AppProtectedDrawer from "./AppProtectedDrawer";
import useToggle from "hooks/use-toggle";
import useLogout from "hooks/use-logout";
import useSidebarIcon from "hooks/use-sidebar-icon";

function AppProtected() {
  const { logout } = useLogout();
  const sidebarIcon = useSidebarIcon();

  // const userClientKycQueryResult = userApi.useGetUserClientKycQuery(undefined);

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
      // loading={userClientKycQueryResult.isLoading}
      // error={userClientKycQueryResult.isError}
      onRetry={() => {
        // if (userClientKycQueryResult.isError) {
        //   userClientKycQueryResult.refetch();
        // }
        // if (userClientKycQueryResult.isError) {
        //   userClientKycQueryResult.refetch();
        // }
      }}
    >
      {() => (
        <>
          <AppProtectedDrawer />
          <AppProtectedHeader />
          <div
            className={clsx(
              sidebarIcon.isOpen ? "lg:ml-[270px]" : "lg:ml-[80px]"
            )}
          >
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
  // const { authUser } = store.getState().global;

  // if (!authUser?.isAuthenticated) {
  //   return redirect(SIGNIN);
  // }

  return null;
}
