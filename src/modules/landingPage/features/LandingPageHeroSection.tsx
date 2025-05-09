import { Button, Typography } from "@mui/material";
import POSWoman from "../../../assets/imgs/pos-woman.png";
import SmilingMan from "../../../assets/imgs/smiling-man.png";
import SlotLogo from "../../../assets/imgs/slot-logo.png";
import ChubLogo from "../../../assets/imgs/3Chub-logo.png";
import ElectromartLogo from "../../../assets/imgs/electomart-logo.png";
import FootCityLogo from "../../../assets/imgs/footcity-logo.png";
import TopSuccessLogo from "../../../assets/imgs/topsuccess-logo.png";
const LandingPageHeroSection = () => {
  // const images = [
  //   SlotLogo,
  //   ChubLogo,
  //   ElectromartLogo,
  //   FootCityLogo,
  //   TopSuccessLogo,
  // ];
  return (
    <div className="mx-auto container px-4 sm:px-2  ">
      <div className="flex flex-col lg:flex-row items-center gap-15 py-2 sm:py-15">
        <div className="w-[45%] ">
          <div className=" lg:max-w-[536px]">
            <Typography
              variant="h2"
              className="font-semibold text-neutral-800 text-[#282F3B] "
            >
              All you need to <span className="text-primary-main">manage</span>{" "}
              and <span className="linearGradientText">grow</span> your business
            </Typography>
            <Typography variant="h5" className="mt-4 md:mt-6 font-normal">
              Unlock flexible credit, automate your payments and track your
              expenses - all in one secure, easy-to-use platform.
            </Typography>
            <Button
              href="/signup"
              variant="gradient"
              size="large"
              className="font-semibold mt-13.5 w-full sm:w-fit"
            >
              Create business account
            </Button>
          </div>
        </div>
        <div className="w-[55%] grid grid-flow-col grid-rows-2 gap-4  h-full max-h-[529px]">
          <div className="row-span-2 ">
            <img
              src={POSWoman}
              alt="POS Woman"
              className="w-full h-full rounded-3xl object-cover "
            />
          </div>
          <div className=" ">
            <img
              src={SmilingMan}
              alt="POS Woman"
              className="w-full h-full rounded-3xl object-cover"
            />
          </div>
          <div className="  ">
            <img
              src={SmilingMan}
              alt="POS Woman"
              className="w-full h-full rounded-3xl  object-cover"
            />
          </div>
        </div>
      </div>
      <div className="bg-white p-8.5 rounded-3xl">
        <Typography
          variant="body2"
          className="font-semibold text-primary-darker text-center"
        >
          TRUSTED BY
        </Typography>
        <div className="grid grid-flow-col auto-cols-max lg:auto-cols-auto scrollbar-hide  mt-8.5 px-6 overflow-auto scroll-smooth snap-x ">
          <div className="flex scrollingAnimate items-center justify-between">
            <img src={SlotLogo} alt="Slot Logo" className="opacity-50 " />
            <img src={ChubLogo} alt="3CHub Logo" className="opacity-50 " />
            <img
              src={ElectromartLogo}
              alt="Electromart Logo"
              className="opacity-50 "
            />
            <img
              src={FootCityLogo}
              alt="FootCity Logo"
              className="opacity-50"
            />{" "}
            <img
              src={TopSuccessLogo}
              alt="TopSuccess Logo"
              className="opacity-50 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeroSection;
