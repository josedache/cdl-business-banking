import { ACCOUNT_SETUP, DASHBOARD } from "constants/urls";
import { RouteObject } from "react-router-dom";

export default [
  {
    path: DASHBOARD,
    lazy: () => import("modules/dashboard/pages/Dashboard"),
  },
  {
    path: ACCOUNT_SETUP,
    lazy: () => import("modules/dashboard/pages/DashboardAccountSetup"),
  },
] as RouteObject[];
