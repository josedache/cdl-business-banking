import { LoadingButton } from "@mui/lab";
import { Divider, IconButton, Paper, Typography } from "@mui/material";
import currencyjs from "currency.js";
import { Icon } from "@iconify/react/dist/iconify.js";

import { TransferContentProps } from "../types/TransferStepForm";

type TransferSingleSuccessProps = {} & TransferContentProps;

export default function TransferSingleSuccess(
  props: TransferSingleSuccessProps
) {
  const { formik } = props;

  return (
    <Paper className="mx-auto max-w-[520px]">
      <form onSubmit={formik.handleSubmit}>
        <div className="h-[450px] flex flex-col justify-center items-center max-w-[450px] mx-auto">
          <div className="flex justify-center mt-5">
            <div className="bg-[#12B76A] border-6 border-[#DBF4E9] w-20 h-20 rounded-full flex items-center justify-center">
              <Icon
                icon="charm:tick"
                width="45"
                stroke="100"
                height="45"
                className="text-white"
              />
            </div>
          </div>

          <Typography variant="h5" className="text-center font-semibold mt-6">
            {currencyjs(formik.values.amount || 0).format({
              symbol: "₦",
            })}{" "}
            successfully sent to SEGUN ADEYINKA AKINNIBOSUN{" "}
          </Typography>

          <div className="flex justify-center mt-8">
            {[
              {
                icon: "tdesign:share-filled",
                text: "Share receipt",
              },
              {
                icon: "tabler:notes",
                text: "View details",
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-2 px-4 py-2 text-sm"
              >
                <IconButton
                  variant="contained"
                  size="large"
                  className="bg-[#F6F8FB] border border-[#E8E8E8] rounded-lg"
                >
                  <Icon icon={icon} width="20" height="20" />
                </IconButton>
                <Typography className="text-neutral-800">{text}</Typography>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="px-4 py-4 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            fullWidth
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
