import { RouteObject } from "react-router-dom";

export default [
  { index: true, lazy: () => import("modules/landingPage/pages/LandingPage") },
] as RouteObject[];
