import { TRANSFER, TRANSFER_BULK } from "constants/urls";
import { RouteObject } from "react-router-dom";

export default [
  {
    path: TRANSFER,
    lazy: () => import("modules/transfer/pages/Transfer"),
  },
  {
    path: TRANSFER_BULK,
    lazy: () => import("modules/transfer/pages/TransferBulk"),
  },
] as RouteObject[];
