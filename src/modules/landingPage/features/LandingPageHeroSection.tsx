import { Button, Typography } from "@mui/material";
import POSWoman from "assets/imgs/pos-woman.png";
import SmilingMan from "assets/imgs/smiling-man.jpg";
import SmilingWoman from "assets/imgs/folding-handsman.jpg";
import SlotLogo from "assets/imgs/slot-logo.png";
import ChubLogo from "assets/imgs/3Chub-logo.png";
import ElectromartLogo from "assets/imgs/electromart-logo.png";
import FootCityLogo from "assets/imgs/footcity-logo.png";
import TopSuccessLogo from "assets/imgs/topsuccess-logo.png";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { motion } from "motion/react";

const LandingPageHeroSection = () => {
  return (
    <div className="mx-auto container">
      <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-15 py-2 lg:py-15 px-4 lg:px-2 ">
        <div className="w-full h-full lg:w-[45%] ">
          <div className=" w-full lg:max-w-[536px]">
            <div className="xl:h-[180px] overflow-hidden relative">
              <motion.div
                initial={{ opacity: 0, y: 180 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: "easeOut", delay: 0.4 }}
              >
                <Typography
                  variant="h2"
                  className="font-semibold text-[#282F3B] leading-[49px] xl:leading-none text-[45px] xl:text-6xl"
                >
                  All you need to{" "}
                  <span className="text-primary-main">manage</span> and{" "}
                  <span className="linearGradientText">grow</span> your business
                </Typography>
              </motion.div>
            </div>
            <div className="relative overflow-hidden h-fit">
              <motion.div
                initial={{ opacity: 0, y: 74 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.6 }}
              >
                <Typography variant="h5" className="mt-4 md:mt-6 font-normal ">
                  Unlock flexible credit, automate your payments and track your
                  expenses - all in one secure, easy-to-use platform.
                </Typography>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scaleY: 0, transformOrigin: "bottom" }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1.7, ease: "easeOut", delay: 0.8 }}
            >
              <Button
                href="/signup"
                variant="gradient"
                size="large"
                className="group font-semibold mt-4 md:mt-13.5 w-full sm:w-fit herobuttonhover"
              >
                Create business account
                <span className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-400">
                  <Iconify
                    fontSize={20}
                    icon="tabler:arrow-right"
                    className="cursor-pointer text-white"
                  />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="w-full lg:w-[55%]">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 relative overflow-hidden h-full  max-h-[526px]">
            <motion.div
              initial={{ opacity: 0, y: 500, transformOrigin: "bottom" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.8 }}
              className="row-span-2  bg-[#ffe2c9] rounded-3xl overflow-hidden "
            >
              <img
                src={POSWoman}
                alt="POS Woman"
                className="w-full h-full rounded-3xl object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -450, transformOrigin: "top" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 1.0 }}
              className="bg-[#ffe2c9] rounded-3xl"
            >
              <img
                src={SmilingWoman}
                alt="POS Woman"
                className="w-full h-full rounded-3xl object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -450, transformOrigin: "top" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 1.0 }}
              className="bg-[#ffe2c9] rounded-3xl"
            >
              <img
                src={SmilingMan}
                alt="POS Woman"
                className="w-full h-full rounded-3xl object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 500, transformOrigin: "bottom" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.8 }}
        className="px-0 lg:px-2"
      >
        <div className="sm:bg-white sm:p-8.5 rounded-3xl mt-20 lg:mt-0">
          <Typography
            variant="body2"
            className="font-semibold text-primary-darker text-center hidden sm:block"
          >
            TRUSTED BY
          </Typography>
          <div className="grid grid-flow-col auto-cols-max lg:auto-cols-auto scrollbar-hide  mt-8.5 px-6 overflow-auto scroll-smooth snap-x ">
            <div className="flex scrollingAnimate items-center justify-between gap-2 sm:gap-0">
              <img
                src={SlotLogo}
                alt="Slot Logo"
                className="opacity-50 hover:opacity-100 rounded-3xl sm:rounded-none bg-white py-8.5 sm:py-0 px-8.5 sm:px-0"
              />
              <img
                src={ChubLogo}
                alt="3CHub Logo"
                className="opacity-50 hover:opacity-100 rounded-3xl sm:rounded-none bg-white  py-8.5 sm:py-0 px-8.5 sm:px-0"
              />
              <img
                src={ElectromartLogo}
                alt="Electromart Logo"
                className="opacity-50 hover:opacity-100 rounded-3xl sm:rounded-none bg-white py-8.5 sm:py-0 px-8.5 sm:px-0"
              />
              <img
                src={FootCityLogo}
                alt="FootCity Logo"
                className="opacity-50 hover:opacity-100 rounded-3xl sm:rounded-none bg-white py-7 sm:py-0 px-8.5 sm:px-0"
              />{" "}
              <img
                src={TopSuccessLogo}
                alt="TopSuccess Logo"
                className="opacity-50 hover:opacity-100 rounded-3xl sm:rounded-none bg-white py-8.5 sm:py-0 px-8.5 sm:px-0"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPageHeroSection;
