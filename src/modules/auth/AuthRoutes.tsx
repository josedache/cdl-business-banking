import { SIGNIN, SIGNUP, RESET_PASSWORD } from "constants/urls";
import { RouteObject } from "react-router-dom";

export default [
  {
    path: SIGNUP,
    lazy: () => import("modules/auth/pages/AuthSignup"),
  },
  {
    path: SIGNIN,
    lazy: () => import("modules/auth/pages/AuthSignin"),
  },
  {
    path: RESET_PASSWORD,
    lazy: () => import("modules/auth/pages/AuthResetPassword"),
  },
] as RouteObject[];
