import LandingPageBusinessReasons from "../features/LandingPageBusinessReasons";
import LandingPageFAQSection from "../features/LandingPageFAQSection";
import LandingPageHeroSection from "../features/LandingPageHeroSection";
import LandingPageMoreFeatures from "../features/LandingPageMoreFeatures";

const LandingPageIndex = () => {
  return (
    <div>
      <LandingPageHeroSection />
      <LandingPageBusinessReasons />
      <LandingPageMoreFeatures />
      <LandingPageFAQSection />
    </div>
  );
};

export default LandingPageIndex;

export const Component = LandingPageIndex;
