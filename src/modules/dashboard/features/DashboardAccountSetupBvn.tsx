import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  ButtonBase,
  Divider,
  FormHelperText,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import NumberTextField from "components/NumberTextField";
import SecuredDataBadge from "components/SecuredDataBadge";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";

type DashboardAccountSetupBvnProps = {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBvn(
  props: DashboardAccountSetupBvnProps
) {
  const { formik, stepper } = props;

  return (
    <Paper className="mx-auto max-w-[600px]">
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
            Provide BVN
          </Typography>
          <Typography className=" text-neutral-500">
            Your BVN helps us link your bank account and unlock transactions.
          </Typography>
          <NumberTextField
            freeSolo
            fullWidth
            slotProps={{
              input: {
                inputProps: {
                  maxLength: 11,
                },
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
            label="BVN (Bank Verification Number)"
            placeholder="19392398293"
            className="mt-10"
            {...getTextFieldProps(formik, "bvn")}
          />
          <FormHelperText>
            We use it only for verification and never share your data
          </FormHelperText>
        </div>
        <Divider />
        <div className="px-4 pb-4">
          <LoadingButton
            variant="gradient"
            type="submit"
            fullWidth
            disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
            className="my-5"
          >
            Continue
          </LoadingButton>

          <div className="flex items-center justify-center gap-2">
            <SecuredDataBadge />
          </div>
        </div>
      </form>
    </Paper>
  );
}
