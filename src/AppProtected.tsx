/* eslint-disable react-refresh/only-export-components */
import { Outlet, redirect } from "react-router-dom";
import { useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import LoadingContent from "components/LoadingContent";
import useAuthUser from "hooks/use-auth-user";
import AuthRefreshTokenDialog from "modules/auth/features/AuthRefreshTokenDialog";
import useToggle from "hooks/use-toggle";
import useLogout from "hooks/use-logout";
import { userApi } from "apis/user.ts";
import store from "configs/store";
import { SIGNIN } from "constants/urls";

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
      // loading={userQueryResult.isLoading}
      // error={userQueryResult.isError}
      // onRetry={userQueryResult.refetch}
    >
      {() => (
        <>
          <Outlet />
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
