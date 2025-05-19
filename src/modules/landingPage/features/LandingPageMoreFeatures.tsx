import { Typography } from "@mui/material";
import PosLogo from "../../../assets/svgs/pos-logo.svg";
import InvoiceLogo from "../../../assets/svgs/invoice-logo.svg";
import InvestmentLogo from "../../../assets/svgs/investment-logo.svg";
import LoanLogo from "../../../assets/svgs/loan-logo.svg";
import BnplLogo from "../../../assets/svgs/bnpl-logo.svg";
import AccountLogo from "../../../assets/svgs/account-logo.svg";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const LandingPageMoreFeatures = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const futureIdeas = [
    {
      id: 1,
      title: "Business Investments",
      note: "Grow your business faster, soon, CDL will help you invest extra capital to dream even bigger.",
      icon: InvestmentLogo,
    },
    {
      id: 2,
      title: "Business Loan",
      note: "Access flexible financing built for your ambitions, helping you scale and thrive with ease.",
      icon: LoanLogo,
    },
    {
      id: 3,
      title: " Buy Now, Pay later",
      note: "Empower your customers with easy installments, driving loyalty while boosting your sales.",
      icon: BnplLogo,
    },
    {
      id: 4,
      title: " Multi-account Management",
      note: " Stay in full control, manage multiple accounts, teams, or branches easily from one dashboard.",
      icon: AccountLogo,
    },
    {
      id: 5,
      title: "Invoice management",
      note: "Track, organize, and manage your invoices effortlessly, fueling your financial growth with Credit Direct Business.",
      icon: InvoiceLogo,
    },
    {
      id: 6,
      title: "POS Transactions",
      note: "Accept payments anywhere, on-the-go or in-store—and track every transaction right from your app.",
      icon: PosLogo,
    },
  ];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      id="products"
      className="mx-auto container  px-4 lg:px-2  text-center md:mt-5 py-20 "
    >
      <Typography className="font-normal text-primary-darker ">
        Services coming soon...
      </Typography>
      <Typography variant="h2" className="font-semibold text-neutral-800 mt-2">
        There is more to come
      </Typography>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-15 gap-6">
        {futureIdeas.map((item) => {
          return (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 100 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              key={item.id}
              className=" text-[#282F3B] text-start rounded-3xl border border-[#EAEAEA] p-6"
              style={{
                background:
                  "linear-gradient(253deg, #F2F2F2 67.71%, rgba(255, 232, 202, 0.50) 140.15%)",
              }}
            >
              <img src={item.icon} alt="Electromart Logo" className=" " />
              <Typography variant="h5" className="font-semibold mt-5">
                {item.title}
              </Typography>
              <Typography className="font-normal mt-2 xl:w-89.5">
                {item.note}
              </Typography>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LandingPageMoreFeatures;
