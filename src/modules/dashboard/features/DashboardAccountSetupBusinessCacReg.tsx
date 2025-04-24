import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  ButtonBase,
  Dialog,
  DialogContent,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SecuredDataBadge from "components/SecuredDataBadge";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";
import { BusinessCacRegInfo } from "types/user-api";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import useToggle from "hooks/use-toggle";
import { format } from "date-fns";

type DashboardAccountSetupBusinessCacRegProps = {
  previewInfo?: BusinessCacRegInfo;
} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBusinessCacReg(
  props: DashboardAccountSetupBusinessCacRegProps
) {
  const { formik, previewInfo, stepper } = props;
  const isPreview = !!previewInfo;
  const [openBusinessPreviewDialog, toggleBusinessPreviewDialog] =
    useToggle(false);

  const previewData = [
    { title: "Company Type", value: previewInfo?.companyType || "N/A" },
    {
      title: "Date of Registration / Incorporation",
      value: previewInfo?.registrationDate
        ? format(new Date(previewInfo?.registrationDate), "PP")
        : "N/A",
    },
    {
      title: "Company Status",
      value: previewInfo?.active ? "Active" : "Inactive",
    },
    {
      title: "Business/Registered Address",
      value: previewInfo?.address || "N/A",
    },
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
            Provide your CAC Number
          </Typography>
          <Typography className=" text-neutral-500">
            Ensure you enter the correct CAC Number and an OTP would be sent to
            your registered email address
          </Typography>
          <TextField
            freeSolo
            fullWidth
            disabled={isPreview}
            slotProps={{
              input: {
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
            label="CAC Number"
            placeholder="e.g RC718688"
            className="mt-10"
            {...getTextFieldProps(formik, "rcNumber")}
          />

          {isPreview && (
            <Paper className="p-4 bg-[#F6F8FB] mt-4" elevation={0}>
              <div>
                <Typography
                  variant="body1"
                  className="font-semibold text-neutral-600"
                >
                  Review Business Details
                </Typography>
                <Typography variant="body2" className="text-neutral-500">
                  Please confirm your business details as provided by CAC{" "}
                </Typography>
              </div>

              <Divider className="pt-2" />

              <div className="flex items-center gap-2 w-full justify-between flex-wrap mt-4">
                <div className="flex items-center gap-2 ">
                  <Paper
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-[#030712]"
                    elevation={0}
                  >
                    <Icon
                      className="text-white"
                      icon="ph:buildings-fill"
                      fontSize={24}
                    />
                  </Paper>
                  <div>
                    <Typography variant="body1">{previewInfo?.name}</Typography>
                    <Typography variant="body2" className="text-neutral-600">
                      {previewInfo?.companyType}
                    </Typography>
                  </div>
                </div>

                <div>
                  <ButtonBase
                    onClick={toggleBusinessPreviewDialog}
                    className="text-primary-main font-semibold"
                  >
                    View Details
                  </ButtonBase>
                </div>
              </div>

              <Dialog
                open={openBusinessPreviewDialog}
                onClose={toggleBusinessPreviewDialog}
                fullWidth
                maxWidth="xs"
              >
                <DialogTitleXCloseButton onClose={toggleBusinessPreviewDialog}>
                  Business Details
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
            // disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
            className="my-5"
          >
            {isPreview ? "Continue" : "Verify Business Details"}
          </LoadingButton>

          <div className="flex items-center justify-center gap-2">
            <SecuredDataBadge />
          </div>
        </div>
      </form>
    </Paper>
  );
}
