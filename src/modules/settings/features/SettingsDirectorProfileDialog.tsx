import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { SettingsDirectorProfileValues } from "../types/settings-director-profile";
import { SettingsDirectorssProfileStep } from "../enums/settings-directos-profile-step";
import useStepper from "hooks/use-stepper";
import { getTextFieldProps } from "utils/formik/get-text-field-props";

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
  const stepper = useStepper({
    initialStep: SettingsDirectorssProfileStep.ALL_DIRECTORS_PROFILES,
  });

  const formik = useFormik<SettingsDirectorProfileValues>({
    initialValues: {
      bvn: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async () => {
      try {
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to process", {
          variant: "error",
        });
      }
    },
  });

  const tabs = [
    {
      content: (
        <>
          <div className="space-y-4">
            {directorsList?.map((opt, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center border border-neutral-200 rounded-xl p-4 "
                >
                  <div className="flex gap-4 items-center">
                    <Avatar
                      src={opt.avatar}
                      className={`w-12 h-12 text-base font-medium uppercase ${isEven ? "bg-[#FEEEDA] text-warning-700" : "bg-sky-100 text-[#1D74B5]"}`}
                    >
                      {opt?.firstName?.[0]}
                      {opt?.lastName?.[0]}
                    </Avatar>

                    <div className=" ">
                      <Typography className="font-medium text-base capitalize">
                        {opt?.firstName} {opt?.lastName}
                      </Typography>
                      <Typography className="text-neutral-500">
                        {opt?.phone ?? ""}
                      </Typography>
                    </div>
                  </div>

                  <Typography className="text-primary-main/25 font-semibold cursor-pointer">
                    Edit
                  </Typography>
                </div>
              );
            })}

            {/* <div className="mt-6 mb-6">
              <Typography
                onClick={() => {
                  stepper.next();
                }}
                className="font-semibold text-primary-main ml-4"
              >
                + Add Another Director
              </Typography>
            </div> */}
          </div>
        </>
      ),
    },
    {
      content: (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="BVN"
            placeholder="Enter your BVN"
            {...getTextFieldProps(formik, "bvn")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            placeholder="Enter your First Name"
            {...getTextFieldProps(formik, "firstName")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            placeholder="Enter your Last Name"
            {...getTextFieldProps(formik, "lastName")}
          />
        </>
      ),
    },
  ];

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      {...rest}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "520px", // Set your width here
          },
        },
      }}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
    >
      <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
        <Typography variant="h5" className="font-semibold text-start">
          Director Profiles
        </Typography>
      </DialogTitleXCloseButton>
      <Divider />
      <DialogContent className="px-6 h-full max-h-80">
        {tabs[stepper.step]?.content}
      </DialogContent>
      {/* <Divider /> */}
      <DialogActions className=" px-6 py-5 flex ml-auto">
        <LoadingButton
          variant="gradient"
          type="submit"
          size="large"
          disabled
          loading={formik.isSubmitting}
          loadingPosition="end"
          className="flex ml-auto px-10 "
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDirectorProfileDialog;
