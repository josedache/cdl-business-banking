import { Outlet } from "react-router-dom";
import LandingPageHeader from "./pages/LandingPageHeader";

const LandingPage = () => {
  return (
    <div>
      <LandingPageHeader />
      <Outlet />
    </div>
  );
};

export default LandingPage;

export const Component = LandingPage;
