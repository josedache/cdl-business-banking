import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  ButtonBase,
  Dialog,
  DialogContent,
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
import { NinBvnInfo } from "types/user-api";
import useToggle from "hooks/use-toggle";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";

type DashboardAccountSetupBvnProps = {
  previewInfo?: NinBvnInfo;
} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBvn(
  props: DashboardAccountSetupBvnProps
) {
  const { formik, previewInfo, stepper } = props;
  const isPreview = !!previewInfo;
  const [openBvnPreviewDialog, toggleBvnPreviewDialog] = useToggle(false);

  const previewData = [
    { title: "BVN Number", value: previewInfo?.bvn || "N/A" },
    {
      title: "Full Name",
      value: previewInfo?.firstName + " " + previewInfo?.lastName || "N/A",
    },
    { title: "Date of Birth", value: previewInfo?.dateOfBirth || "N/A" },
    { title: "Gender", value: previewInfo?.gender || "N/A" },
    { title: "Marital Status", value: previewInfo?.maritalStatus || "N/A" },
    { title: "State of Origin", value: previewInfo?.localGovernment || "N/A" },
    { title: "LGA", value: previewInfo?.localGovernment || "N/A" },
    { title: "Email", value: previewInfo?.email || "N/A" },
    { title: "Phone Number", value: previewInfo?.phoneNumber || "N/A" },
  ];

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
            Provide BVN
          </Typography>
          <Typography className=" text-neutral-500">
            Your BVN helps us link your bank account and unlock transactions.
          </Typography>
          <NumberTextField
            freeSolo
            disabled={isPreview}
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

          {isPreview && (
            <Paper className="p-4 bg-[#F6F8FB] mt-4" elevation={0}>
              <div>
                <Typography
                  variant="body1"
                  className="font-semibold text-neutral-600"
                >
                  Review BVN Details
                </Typography>
                <Typography variant="body2" className="text-neutral-500">
                  Please confirm your personal details as provided by BVN
                </Typography>
              </div>

              <Divider className="pt-2" />

              <div className="flex items-center gap-2 w-full justify-between flex-wrap mt-4">
                <div className="flex items-center gap-2 ">
                  <Avatar
                    src={previewInfo?.image || ""}
                    className="w-11 h-11"
                  />
                  <Typography variant="body1" className="font-semibold">
                    {previewInfo?.firstName + " " + previewInfo?.lastName}
                  </Typography>
                </div>

                <div>
                  <ButtonBase
                    onClick={toggleBvnPreviewDialog}
                    className="text-primary-main font-semibold"
                  >
                    View Details
                  </ButtonBase>
                </div>
              </div>

              <Dialog
                open={openBvnPreviewDialog}
                onClose={toggleBvnPreviewDialog}
                fullWidth
                maxWidth="xs"
              >
                <DialogTitleXCloseButton onClose={toggleBvnPreviewDialog}>
                  BVN Details
                </DialogTitleXCloseButton>
                <Divider />
                <DialogContent className="grid grid-cols-2 gap-4">
                  {previewData.map((item) => (
                    <div key={item.title}>
                      <Typography variant="body2" className="text-neutral-500">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" className="text-neutral-800">
                        {item.value}
                      </Typography>
                    </div>
                  ))}
                </DialogContent>
              </Dialog>
            </Paper>
          )}
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
