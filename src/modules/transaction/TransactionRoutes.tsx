import { TRANSACTION } from "constants/urls";
import { RouteObject } from "react-router-dom";

export default [
  {
    path: TRANSACTION,
    lazy: () => import("modules/transaction/pages/TransactionList"),
  },
] as RouteObject[];
