import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ButtonBase,
  CardActionArea,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { ONBOARDING_STEPS } from "../enums/onboardingStepsEnum";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";

type DashboardAccountSetupBusinessProps =
  {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBusiness(
  props: DashboardAccountSetupBusinessProps
) {
  const { formik, stepper } = props;

  return (
    <Paper elevation={0} className="mx-auto max-w-[600px]">
      <form onSubmit={formik.handleSubmit}>
        <div className="p-6">
          <ButtonBase
            disableRipple
            className="flex items-center gap-2"
            onClick={() => stepper.previous()}
          >
            <Icon icon="weui:back-filled" fontSize={20} />
            <Typography>Go back</Typography>
          </ButtonBase>
        </div>

        <Divider />
        <div className="px-6 pt-4 ">
          <Typography variant="h5" className="">
            What type of business do you own?{" "}
          </Typography>
          <Typography className=" text-neutral-500">
            Let’s confirm your business type to give you the best experience
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-6 pb-8">
          {[
            {
              icon: "hugeicons:building-03",
              title: "Business registered with CAC",
              to: ONBOARDING_STEPS.BUSINESS_CAC_REGISTRATION,
              description: "You’ll need your CAC number to proceed",
            },
            // {
            //   icon: "solar:document-bold",
            //   title: "Business not yet registered with CAC",
            //   to: ONBOARDING_STEPS.BUSINESS_NON_CAC_REGISTRATION,
            //   description: "You’ll provide a few details to continue",
            // },
          ].map(({ icon, title, description, ...rest }) => (
            <CardActionArea
              key={title}
              {...rest}
              onClick={() => {
                stepper.go(rest.to);
              }}
              className="flex gap-3 py-4 px-6  w-full"
            >
              <Paper
                elevation={0}
                className="rounded-full bg-[#FFF3EE] border-1 border-[#FECBB9] p-3 w-fit"
              >
                <Icon
                  className="text-[#C53D0D]"
                  icon={icon}
                  width="24"
                  height="24"
                />
              </Paper>
              <div className="flex-1">
                <Typography className="font-medium text-neutral-900">
                  {title}
                </Typography>
                <Typography className="text-neutral-500 font-medium mt-2">
                  {description}
                </Typography>
              </div>
              <Icon icon="icon-park-outline:right" width="24" height="24" />
            </CardActionArea>
          ))}
        </div>
      </form>
    </Paper>
  );
}
