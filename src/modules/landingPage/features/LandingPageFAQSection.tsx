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
import SwirlyBackground from "../../../assets/imgs/readytojoin-bg.png";

const LandingPageFAQSection = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const faqs = [
    {
      question: "Do I need a registered company to use CDL Business?",
      answer: "Yes",
    },
    {
      question: "Are there any hidden fees?",
      answer: "Nope!",
    },
    {
      question: "What do I need to create an account??",
      answer: "Chi ching Chi ching fundzzzz",
    },
    {
      question: "How safe are my details?",
      answer: "Like God wraps you safe",
    },
  ];
  return (
    <div>
      <div className="mx-auto container px-4 sm:px-2 text-center md:py-29 bg-[#FCFCFC] rounded-3xl">
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
              className=" bg-white rounded-lg px-2 py-4 mb-2 text-[#282F3B]"
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
                className=" font-semibold "
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
        className=" rounded-3xl mx-auto py-20 text-white px-4 sm:px-2 "
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
            className="font-semibold mx-auto lg:w-2/3 xl:w-1/3"
          >
            Ready to join 20,000+ satisfied customers?
          </Typography>
          <Button className="bg-white text-[#282F3B] mt-20 font-semibold">
            Create business account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageFAQSection;
