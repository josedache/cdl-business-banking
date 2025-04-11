import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import { ButtonBase, Divider, Paper, Typography } from "@mui/material";

import { TransferContentProps } from "../types/TransferStepForm";
import OtpInput from "components/OtpInput";
import NumberInput from "components/NumberInput";

type TransferSingleEnterPaymentPinProps = {} & TransferContentProps;

export default function TransferSingleEnterPaymentPin(
  props: TransferSingleEnterPaymentPinProps
) {
  const { formik, stepper } = props;

  return (
    <Paper className="mx-auto max-w-[520px]">
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
        <div className="px-6 py-6">
          <Typography variant="h5" className="text-center">
            Enter Payment Pin
          </Typography>

          <div className="mt-[21px]">
            <div className="grid justify-center gap-4">
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

              <ButtonBase disableRipple onClick={() => stepper.previous()}>
                Forgot payment PIN?
              </ButtonBase>
            </div>
          </div>
        </div>
        <Divider />
        <div className="px-4 py-4 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
