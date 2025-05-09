import { Typography } from "@mui/material";
import Logo from "components/Logo";
import { Link } from "react-router-dom";

const LandingPageFooter = () => {
  return (
    <footer className="container mx-auto  px-4 sm:px-2  pt-17.5 pb-10">
      <div className="grid md:grid-cols-3 gap-33 ">
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
          <Typography className="font-normal">Contact Us</Typography>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-6">
        <Typography>© 2025 CDL Business. All rights reserved.</Typography>
        <div className=" flex font-normal gap-4">
          <Typography>Privacy Policy </Typography>
          <Typography>Terms of Service</Typography>
          <Typography> Cookie Policy</Typography>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
