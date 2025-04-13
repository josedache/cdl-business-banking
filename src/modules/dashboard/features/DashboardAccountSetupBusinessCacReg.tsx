import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  ButtonBase,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SecuredDataBadge from "components/SecuredDataBadge";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";

type DashboardAccountSetupBusinessCacRegProps =
  {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBusinessCacReg(
  props: DashboardAccountSetupBusinessCacRegProps
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
        <div className="px-6 pt-4 pb-8">
          <Typography variant="h5" className="">
            Provide your CAC Number
          </Typography>
          <Typography className=" text-neutral-500">
            Ensure you enter the correct CAC Number and an OTP would be sent to
            your registered email address
          </Typography>
          <TextField
            freeSolo
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon
                      icon="hugeicons:security-lock"
                      width="24"
                      height="24"
                      className="text-neutral-950"
                    />
                  </InputAdornment>
                ),
              },
            }}
            label="CAC Number"
            placeholder="RC718688"
            className="mt-10"
            {...getTextFieldProps(formik, "rcNumber")}
          />
        </div>
        <Divider />
        <div className="px-4 pb-4">
          <LoadingButton
            variant="gradient"
            type="submit"
            fullWidth
            // disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
            className="my-5"
          >
            Verify Business Details
          </LoadingButton>

          <div className="flex items-center justify-center gap-2">
            <SecuredDataBadge />
          </div>
        </div>
      </form>
    </Paper>
  );
}
