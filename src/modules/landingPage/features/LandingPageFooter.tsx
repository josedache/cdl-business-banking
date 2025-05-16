import { Typography } from "@mui/material";
import Logo from "components/Logo";
import { Link } from "react-router-dom";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";

const LandingPageFooter = () => {
  const media = [
    {
      id: 1,
      icon: "uim:facebook-f",
      link: "https://www.facebook.com/creditdirectltd/",
    },
    {
      id: 2,
      icon: "icon-park-solid:instagram",
      link: "https://www.instagram.com/creditdirectltd/",
    },
    {
      id: 3,
      icon: "grommet-icons:linkedin-option",
      link: "https://www.linkedin.com/company/11500510",
    },
  ];

  const company = [
    {
      name: "Privacy Policy",
      href: "https://www.creditdirect.ng/privacy-policy/",
    },
    {
      name: "Terms of Service",
      href: "https://yield.creditdirect.ng/terms-and-conditions",
    },
    { name: "About", href: "https://www.creditdirect.ng/about-us/" },
  ];

  return (
    <footer className="container mx-auto  px-4 lg:px-2  pt-17.5 pb-10">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-33 ">
        <div>
          <Link to="/">
            <Logo variant="1" />
          </Link>
          <Typography className="mt-2 font-normal ">
            Credit Direct Business is a fintech arm of Credit Direct Limited,
            that offers banking services to SMEs with or without a registered
            business.
          </Typography>
        </div>
        <div>
          <Typography variant="h5" className="font-medium">
            Support
          </Typography>
          <Link to="https://www.creditdirect.ng/contact-us" target="_blank">
            <Typography className="font-normal mt-2">Contact Us</Typography>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 items-center mt-7">
        {media?.map((item) => {
          return (
            <Link
              to={item.link}
              target="_blank"
              key={item.id}
              className="bg-white p-1 rounded-sm"
            >
              <Iconify
                fontSize={18}
                icon={item.icon}
                className="cursor-pointer text-[#14181F]"
              />
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-6 gap-2 ">
        <Typography className="font-normal">
          © 2025 CDL Business. All rights reserved.
        </Typography>
        <div className=" flex font-normal gap-4">
          {company?.map((item, index) => {
            return (
              <Link to={item.href} target="_blank" key={index} className="">
                <Typography className="font-normal">{item.name} </Typography>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
