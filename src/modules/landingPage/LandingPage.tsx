import { Outlet } from "react-router-dom";
import LandingPageHeader from "./features/LandingPageHeader";
import LandingPageFooter from "./features/LandingPageFooter";
import "./features/LandingPageStyles.css";

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
