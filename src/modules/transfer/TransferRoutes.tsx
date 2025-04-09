import { TRANSFER } from "constants/urls";
import { RouteObject } from "react-router-dom";

export default [
  {
    path: TRANSFER,
    lazy: () => import("modules/transfer/pages/Transfer"),
  },
] as RouteObject[];
