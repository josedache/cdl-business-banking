import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import SwirlyBackground from "assets/imgs/readytojoin-bg.png";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const LandingPageFAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const faqs = [
    {
      question: "Who can open a business account?",
      answer:
        "Any registered business (e.g., sole proprietorship, limited liability company, or partnership) with valid documentation (CAC certificate, TIN) can open an account.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden charges. We operate a transparent fee structure — with no maintenance fees on standard accounts.",
    },
    {
      question: "What do I need to create an account??",
      answer:
        "You’ll need Corporate Affairs Commission (CAC) registration documents,Tax Identification Number (TIN), Valid ID of business owner(s), and Bank Verification Number (BVN)",
    },
    {
      question: "How safe are my details?",
      answer:
        "We use bank-grade encryption, multi-factor authentication (MFA), and secure cloud infrastructure to protect your data.",
    },
  ];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      className="mb-2.5 xl:mb-40"
    >
      <div className="mx-auto container px-4 lg:px-2 text-center py-5 md:py-29 bg-[#FCFCFC] rounded-t-3xl">
        <Typography variant="h2" className="font-semibold text-neutral-800 ">
          Frequently Asked Questions
        </Typography>
        <div className="mt-8 md:mt-15 md:w-4/6 mx-auto ">
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              elevation={0}
              expanded={expanded === `panel-${index}`}
              onChange={handleChange(`panel-${index}`)}
              sx={{
                "&:before": {
                  display: "none",
                },
              }}
              className="bg-white rounded-lg py-4 mb-2 text-[#282F3B]"
            >
              <AccordionSummary
                key={faq.question}
                expandIcon={
                  expanded === `panel-${index}` ? (
                    <IconButton className=" bg-[#EEF2F8] rounded-full">
                      <Iconify
                        fontSize={20}
                        icon="tabler:minus"
                        className="cursor-pointer text-[#282F3B]"
                      />
                    </IconButton>
                  ) : (
                    <IconButton className=" bg-[#EEF2F8] rounded-full">
                      <Iconify
                        fontSize={20}
                        icon="si:add-fill"
                        className="cursor-pointer text-[#282F3B]"
                      />
                    </IconButton>
                  )
                }
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
                className=" font-semibold py-0"
              >
                {faq.question}
              </AccordionSummary>
              <AccordionDetails className="font-semibold text-start ">
                {faq.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
      <div
        className="container bg-[rgba(0,0,0,.5)] rounded-3xl mx-auto py-8 sm:py-20 text-white px-4 lg:px-2 -mt-5 bg-repeat"
        style={{
          backgroundImage: `
            linear-gradient(252.66deg, #FFFFFF 31.57%, #F79009 140.15%),
            linear-gradient(124.29deg, #96324A -7.26%, #FF6731 64.16%, #EFC531 122.07%),
            url(${SwirlyBackground})
          `,
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="text-center">
          <Typography
            variant="h2"
            className="font-semibold mx-auto lg:w-3/5 xl:w-5/12 "
          >
            Ready to join 20,000+ satisfied customers?
          </Typography>
          <Button
            href="/signup"
            className="bg-white group text-[#282F3B] mt-6 md:mt-20 font-semibold md:mb-14"
          >
            Create business account
            <span className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-400 ">
              <Iconify
                fontSize={20}
                icon="tabler:arrow-right"
                className="cursor-pointer"
              />
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPageFAQSection;
