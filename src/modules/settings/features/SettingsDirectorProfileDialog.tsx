import {
  Avatar,
  Dialog,
  DialogProps,
  Divider,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { SettingsDirectorProfileValues } from "../types/settings-director-profile";

type SettingsDirectorProfileDialogProps = {
  onClose: () => void;
  directorsList: [
    {
      firstName: string;
      lastName: string;
      phone?: string;
      avatar?: string;
    },
  ];
} & DialogProps;

const SettingsDirectorProfileDialog = (
  props: SettingsDirectorProfileDialogProps
) => {
  const { onClose, directorsList, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik<SettingsDirectorProfileValues>({
    initialValues: {
      name: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({}),
    //eslint-disable-next-line
    onSubmit: async (values) => {
      try {
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to process", {
          variant: "error",
        });
      }
    },
  });

  return (
    <Dialog fullWidth maxWidth="sm" {...rest}>
      <form onSubmit={formik.handleSubmit as any} className=" ">
        <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
          <Typography variant="h5" className="font-semibold text-start">
            Director Profiles
          </Typography>
        </DialogTitleXCloseButton>
        <Divider />

        <div className="px-6 mt-4 space-y-4">
          {directorsList?.map((opt, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center border border-neutral-200 rounded-xl p-4 "
              >
                <div className="flex gap-4 items-center">
                  <Avatar
                    src={opt.avatar}
                    className="w-14 h-14 font-medium bg-warning-100/80 text-warning-700 uppercase"
                  >
                    {opt?.firstName?.[0]}
                    {opt?.lastName?.[0]}
                  </Avatar>

                  <div className=" ">
                    <Typography variant="h6" className="font-medium capitalize">
                      {opt?.firstName} {opt?.lastName}
                    </Typography>
                    <Typography className="text-neutral-500">
                      {opt?.phone ?? ""}
                    </Typography>
                  </div>
                </div>

                <Typography className="text-primary-main font-semibold cursor-pointer">
                  Edit
                </Typography>
              </div>
            );
          })}

          <div className="mt-6 mb-6">
            <Typography className="font-semibold text-primary-main ml-4">
              + Add Another Director
            </Typography>
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

export default SettingsDirectorProfileDialog;
