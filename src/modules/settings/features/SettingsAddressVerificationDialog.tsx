import { Dialog, DialogProps, Divider, Typography } from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { SettingsDirectorProfileValues } from "../types/settings-director-profile";

type SettingsAddressVerificationDialogProps = {
  onClose: () => void;
} & DialogProps;

const SettingsAddressVerificationDialog = (
  props: SettingsAddressVerificationDialogProps
) => {
  const { onClose, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik<SettingsDirectorProfileValues>({
    initialValues: {
      name: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async () => {
      try {
      } catch (error: any) {
        enqueueSnackbar(
          error?.data?.message || "Failed to process ",
          {
            variant: "error",
          }
        );
      }
    },
  });

  return (
    <Dialog fullWidth maxWidth="sm" {...rest}>
      <form onSubmit={formik.handleSubmit as any} className=" ">
        <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
          <Typography variant="h5" className="font-semibold text-start">
            Address verification
          </Typography>
        </DialogTitleXCloseButton>
        <Divider />

        <div className="px-6 mt-4">
          <Typography className="font-medium text-lg text-neutral-700">
            Street Address
          </Typography>
          <div className=" mt-2">
              <Typography className="border border-neutral-200  rounded-xl py-2 px-3 font-medium text-lg ml-1">
                21, Savage Street, Ikoyi, Lagos
              </Typography>
          </div>

          <div className="mt-6 mb-6">
            
          </div>
        </div>
        <Divider className="py-3" />
        <div className="sticky bottom-0 p-6 flex ml-auto">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            // disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
            loadingPosition="end"
            className="flex ml-auto px-10 "
          >
            Save
          </LoadingButton>
        </div>
      </form>
    </Dialog>
  );
};

export default SettingsAddressVerificationDialog;
