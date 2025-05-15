import { Typography } from "@mui/material";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const LandingPageBusinessReasons = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const businessReasons = [
    {
      id: 1,
      title: "Manage your way",
      note: "Organize your operations and virtual wallets your way, flexible, simple, and built for how your business runs.",
      subTitle: "Create business account",
    },
    {
      id: 2,
      title: "Interest based account",
      note: "Watch your balance grow, not just your business. Earn competitive interest effortlessly with every deposit.",
      subTitle: "Create business account",
    },
    {
      id: 3,
      title: "Secure transactions",
      note: "Your business deserves security that works as hard as you do. CDL keeps every transaction protected, every step of the way.",
      subTitle: "Create business account",
    },
    {
      id: 4,
      title: "Single & bulk transfers",
      note: "Whether you’re paying one or many, CDL makes every transfer seamless, secure, and right on time.",
      subTitle: "Create business account",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="mx-auto container px-4 lg:px-2  text-center mt-20 md:mt-7.5 md:pt-21.5 md:pb-15"
    >
      <Typography className="font-normal text-primary-darker ">
        There's something for every business
      </Typography>
      <Typography variant="h2" className=" font-semibold text-neutral-800 mt-2">
        Designed for <span className="text-primary-main"> Businesses.</span>
      </Typography>
      <Typography variant="h2" className="font-semibold text-neutral-800 ">
        Built for <span className="linearGradientText">Growth.</span>
      </Typography>

      <div className="grid md:grid-cols-2 mt-8 md:mt-20 gap-4">
        {businessReasons.map((item) => {
          return (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 100 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              key={item.id}
              className="group text-start rounded-2xl py-15 px-8 moreFeaturesBg-gradient "
            >
              <Typography variant="h5" className="font-semibold text-[#FCF2E5]">
                {item.title}
              </Typography>
              <Typography
                variant="h6"
                className="font-normal mt-2 text-[#D7D7D7] xl:w-[564px]"
              >
                {item.note}
              </Typography>
              <Link to="/signup">
                <Typography className="flex items-center font-semibold mt-5.5 text-[#FFF9F7] group-hover:text-primary-main transition-colors duration-300">
                  {item.subTitle}
                  <span className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-400">
                    <Iconify
                      fontSize={20}
                      icon="tabler:arrow-right"
                      className="cursor-pointer text-primary-main"
                    />
                  </span>
                </Typography>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LandingPageBusinessReasons;
