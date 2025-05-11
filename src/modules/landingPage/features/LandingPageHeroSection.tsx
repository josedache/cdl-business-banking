import { Button, Typography } from "@mui/material";
import POSWoman from "../../../assets/imgs/pos-woman.png";
import SmilingMan from "../../../assets/imgs/smiling-man.png";
import SlotLogo from "../../../assets/imgs/slot-logo.png";
import ChubLogo from "../../../assets/imgs/3Chub-logo.png";
import ElectromartLogo from "../../../assets/imgs/electomart-logo.png";
import FootCityLogo from "../../../assets/imgs/footcity-logo.png";
import TopSuccessLogo from "../../../assets/imgs/topsuccess-logo.png";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";

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
      <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-15 py-2 sm:py-15">
        <div className="w-full h-full lg:w-[45%] ">
          <div className=" lg:max-w-[536px] fade-in-up">
            <Typography variant="h2" className="font-semibold text-[#282F3B] ">
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
              className="group font-semibold mt-13.5 w-full sm:w-fit herobuttonhover"
            >
              Create business account
              <span className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-400 ml-">
                <Iconify
                  fontSize={20}
                  icon="tabler:arrow-right"
                  className="cursor-pointer text-white"
                />
              </span>
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-[55%] grid grid-flow-col gap-4 h-full ">
          <div className="row-span-2 slide-in-bottom ">
            <img
              src={POSWoman}
              alt="POS Woman"
              className="w-full h-full rounded-3xl object-cover"
            />
          </div>
          <div className="slide-in-top">
            <img
              src={SmilingMan}
              alt="POS Woman"
              className="w-full h-full rounded-3xl object-cover"
            />
          </div>
          <div className="slide-in-top  ">
            <img
              src={SmilingMan}
              alt="POS Woman"
              className="w-full h-full rounded-3xl  object-cover "
            />
          </div>
        </div>
      </div>
      <div className="bg-white p-8.5 rounded-3xl mt-20 md:mt-0">
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
