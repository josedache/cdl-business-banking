import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import NumberInput from "components/NumberInput";
import OtpInput from "components/OtpInput";

type TransferBulkUploadPaymentPinVerificationProps =
  {} & TransferBulkContentProps;

export default function TransferBulkUploadPaymentPinVerification(
  props: TransferBulkUploadPaymentPinVerificationProps
) {
  const { formik, stepper } = props;

  return (
    <Paper elevation={0} className="mx-auto max-w-[768px]">
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

      <form onSubmit={formik.handleSubmit}>
        <div className="px-6 pt-4 pb-8">
          <div className="px-6 py-6">
            <Typography variant="h5" className="text-center">
              Enter Payment Pin
            </Typography>

            <div className="my-4 max-w-[416px] mx-auto">
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

                <ButtonBase className="text-primary-main" disableRipple>
                  Forgot payment PIN?
                </ButtonBase>
              </div>
            </div>
          </div>
        </div>
        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
          >
            Pay
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
