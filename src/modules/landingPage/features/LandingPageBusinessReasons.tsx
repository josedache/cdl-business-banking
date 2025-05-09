import { Typography } from "@mui/material";

const LandingPageBusinessReasons = () => {
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
    <div className="mx-auto container  px-4 sm:px-2  text-center mt-7.5 pt-21.5 pb-15">
      <Typography className="font-normal text-primary-darker ">
        There's something for every business
      </Typography>
      <Typography className=" text-6xl font-semibold text-neutral-800 mt-2">
        Designed for <span className="text-primary-main"> Businesses.</span>
      </Typography>
      <Typography className=" text-6xl font-semibold text-neutral-800 mt-2">
        Built for <span className="linearGradientText">Growth.</span>
      </Typography>

      <div className="grid md:grid-cols-2 mt-20 gap-4">
        {businessReasons.map((item) => {
          return (
            <div
              key={item.id}
              className="text-start rounded-2xl py-15 px-8"
              style={{
                background:
                  "linear-gradient(0deg, rgba(28, 32, 42, 0.72) 0%, rgba(28, 32, 42, 0.72) 100%), linear-gradient(150deg, #FF4F03 -36.14%, #402824 1.67%, #1C202A 52.77%)",
              }}
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
              <Typography className="font-semibold mt-5.5 text-[#FFF9F7]">
                {item.subTitle}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPageBusinessReasons;
