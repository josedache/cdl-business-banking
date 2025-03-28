/* eslint-disable react-refresh/only-export-components */
import store from "configs/store";
import { DASHBOARD } from "constants/urls";
import { Outlet, redirect } from "react-router-dom";

function AppPublic() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default AppPublic;

export const Component = AppPublic;

export function loader() {
  const { authUser } = store.getState().global;

  console.log('AppPublic')

  if (authUser?.isAuthenticated) {
    return redirect(DASHBOARD);
  }

  return null;
}
