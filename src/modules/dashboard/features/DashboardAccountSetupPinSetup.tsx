import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import { ButtonBase, Divider, Paper, Typography } from "@mui/material";

import NumberInput from "components/NumberInput";
import OtpInput from "components/OtpInput";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";

type DashboardAccountSetupPinSetupProps =
  {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupPinSetup(
  props: DashboardAccountSetupPinSetupProps
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
        <div className="px-6 pt-6 pb-8 flex justify-center items-center w-full">
          <div className="w-full">
            <Typography variant="h5">Create 6-digit transaction Pin</Typography>
            <Typography className="text-neutral-500 w-full">
              Use a PIN you can remember, it’ll be used for all
              transactions{" "}
            </Typography>
            <div className="grid justify-center gap-4 mt-10">
              <OtpInput
                value={formik.values.transactionPin}
                onChange={(otp) => {
                  formik.setFieldValue("transactionPin", otp);
                }}
                numInputs={6}
                shouldAutoFocus
                inputType="password"
                slot={{ input: NumberInput }}
                slotProps={{
                  input: {
                    style: { opacity: formik.isSubmitting ? 0.5 : 1 },
                    disabled: formik.isSubmitting,
                  },
                }}
              />
            </div>
            <LoadingButton
              variant="gradient"
              type="submit"
              fullWidth
              disabled={!formik.isValid || !formik.dirty}
              size="large"
              loading={formik.isSubmitting}
              className="mt-15"
            >
              Next
            </LoadingButton>
          </div>
        </div>
      </form>
    </Paper>
  );
}
