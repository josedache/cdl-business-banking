import { SETTINGS } from "constants/urls";
import { RouteObject } from "react-router-dom";

export default [
    {
        path: SETTINGS,
        lazy: () => import("modules/settings/pages/Settings"),
    }
] as RouteObject[];