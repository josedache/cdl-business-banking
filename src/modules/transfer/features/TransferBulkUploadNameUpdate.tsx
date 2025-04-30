import {
  ButtonBase,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import { getTextFieldProps } from "utils/formik/get-text-field-props";

type TransferBulkUploadNameUpdateProps = {} & TransferBulkContentProps;

export default function TransferBulkUploadNameUpdate(
  props: TransferBulkUploadNameUpdateProps
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

      <form onSubmit={formik.handleSubmit}>
        <div className="px-6 pt-4 pb-8">
          <Typography variant="h5" className="">
            Name your List (Optional)
          </Typography>
          <Typography className=" text-neutral-500">
            To help you identify this list in the future, you may assign it a
            custom name - for example, Employees, Vendors, Family, or Logistics.
          </Typography>
          <div className="mt-8 min-h-[280px]">
            <TextField
              label="Name of List"
              fullWidth
              {...getTextFieldProps(formik, "name")}
              placeholder="Enter name of list"
            />
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
            Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
