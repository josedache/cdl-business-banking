import AppErrorBoundary from "./AppErrorBoundary";
import {
  ACCOUNT_SETUP,
  DASHBOARD,
  ENTRY,
  TRANSACTION,
  TRANSFER,
} from "constants/urls";
import AuthRoutes from "modules/auth/AuthRoutes";
import DashboardRoutes from "modules/dashboard/DashboardRoutes";
import TransferRoutes from "modules/transfer/TransferRoutes";
import { createBrowserRouter } from "react-router-dom";
import TransactionRoutes from "modules/transaction/TransactionRoutes.tsx";

const router = createBrowserRouter([
  {
    path: ENTRY,
    lazy: () => import("./App"),
    ErrorBoundary: AppErrorBoundary,
    children: [
      {
        lazy: () => import("./AppPublic"),
        children: [
          {
            lazy: () => import("./modules/auth/Auth"),
            children: AuthRoutes,
          },
        ],
      },
      {
        lazy: () => import("./AppProtected"),
        children: [
          {
            lazy: () => import("./AppProtectedWithNavigation"),
            children: [
              {
                path: DASHBOARD,
                lazy: () => import("modules/dashboard/Dashboard"),
                children: DashboardRoutes,
              },
              {
                path: TRANSFER,
                lazy: () => import("modules/transfer/Transfer"),
                children: TransferRoutes,
              },
              {
                path: TRANSACTION,
                lazy: () => import("modules/transaction/Transaction"),
                children: TransactionRoutes,
              },
            ],
          },
          {
            path: ACCOUNT_SETUP,
            lazy: () => import("modules/dashboard/pages/DashboardAccountSetup"),
          },
        ],
      },
    ],
  },
]);

export default router;
