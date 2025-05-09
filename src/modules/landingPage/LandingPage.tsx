import { Outlet } from "react-router-dom";
import LandingPageHeader from "./features/LandingPageHeader";
import LandingPageFooter from "./features/LandingPageFooter";

const LandingPage = () => {
  return (
    <div className="bg-custom-gradient">
      <LandingPageHeader />
      <Outlet />
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;

export const Component = LandingPage;
