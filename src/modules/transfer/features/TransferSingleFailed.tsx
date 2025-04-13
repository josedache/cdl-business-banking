import { LoadingButton } from "@mui/lab";
import { Divider, Paper, Typography } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

import { TransferContentProps } from "../types/TransferStepForm";
import { DASHBOARD } from "constants/urls";

type TransferSingleFailedProps = {} & TransferContentProps;

export default function TransferSingleFailed(props: TransferSingleFailedProps) {
  const { formik } = props;

  const navigate = useNavigate();

  return (
    <Paper elevation={0} className="mx-auto max-w-[520px]">
      <form onSubmit={formik.handleSubmit}>
        <div className="h-[450px] flex flex-col justify-center items-center">
          <div className="flex justify-center mt-5">
            <div className="bg-[#D92D20] border-6 border-[#F9E0DE] w-20 h-20 rounded-full flex items-center justify-center">
              <Icon
                icon="ep:close-bold"
                width="45"
                stroke="100"
                height="45"
                className="text-white"
              />
            </div>
          </div>

          <Typography variant="h5" className="text-center font-semibold mt-10">
            Transaction failed
          </Typography>
          <Typography className="text-center text-neutral-500 text-sm mt-2">
            Wait for 5-10 mins before trying again
          </Typography>
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-end">
          <LoadingButton
            type="submit"
            fullWidth
            variant="outlined"
            size="large"
            color="inherit"
            onClick={() => {
              navigate(DASHBOARD);
            }}
          >
            Go back Home{" "}
          </LoadingButton>
          <LoadingButton
            variant="gradient"
            type="submit"
            fullWidth
            size="large"
            disabled={!formik.isValid || !formik.dirty}
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
