import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import {
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import { Fragment } from "react/jsx-runtime";

type TransferBulkUploadProps = {} & TransferBulkContentProps;

export default function TransferBulkUpload(props: TransferBulkUploadProps) {
  const { formik, stepper } = props;
  const { enqueueSnackbar } = useSnackbar();

  const handleClearFile = () => {
    formik.setFieldValue("file", "");
  };

  const handleDownloadFile = () => {
    // Implement file download logic here
  };

  const dropzone = useDropzone({
    multiple: false,
    // accept: {
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    //     ".xlsx",
    //   ],
    //   "application/vnd.ms-excel": [".xls"],
    // },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024, // 3MB
    onDropAccepted: async (files) => {
      try {
        const file = files[0];
        await formik.setFieldValue("file", file);
      } catch {
        enqueueSnackbar(`Failed to attach files`, { variant: "error" });
      }
    },
    onDropRejected: (error) => {
      let message = error[0].errors[0].message || `Failed to attach files`;
      if (error[0].errors[0].code === "file-too-large") {
        message = `File is too large. Maximum file size is 3MB`;
      }
      enqueueSnackbar(message, {
        variant: "error",
      });
    },
  });

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
        <div className="p-6 min-h-[440px]">
          <div>
            <Typography variant="h4" className="font-semibold">
              Upload CSV of Recipients
            </Typography>
            <Typography className="text-neutral-500 mt-2">
              Upload a CSV file (Smaller than 1MB) with the following column:
            </Typography>
            <Typography className="text-neutral-500 font-semibold">
              Name, Bank Name, Account number, Amount{" "}
            </Typography>
          </div>

          {formik.values.file ? (
            <div className="p-4 mt-8 border-dashed border font-medium rounded-lg border-neutral-300">
              <div className="flex gap-4 items-center w-full">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary-50  p-2 rounded-full">
                    <Icon icon="tabler:file-text" width="15" height="15" />
                  </div>
                </div>

                <div className="flex-auto w-full">
                  <Typography noWrap>
                    {(formik.values.file as unknown as File)?.name}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <IconButton onClick={handleDownloadFile}>
                    <Icon icon="ci:download" width="15" height="15" />
                  </IconButton>

                  <IconButton onClick={handleClearFile}>
                    <Icon icon="stash:trash-can" width="15" height="15" />
                  </IconButton>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={clsx(
                formik?.errors?.file ? "border-red-500 " : "",
                "p-4 mt-8 border-dashed border rounded-lg border-neutral-300"
              )}
              {...dropzone.getRootProps()}
            >
              <input {...dropzone.getInputProps()} />
              <div className="flex flex-col items-center justify-center p-4 text-neutral-500">
                <>
                  <Icon
                    icon="solar:cloud-upload-broken"
                    width="25"
                    height="25"
                  />
                  <Typography>Click to upload file</Typography>
                  <Typography>format: CSV</Typography>
                </>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center gap-1 mt-4">
            <Icon
              icon="ci:download"
              width="12"
              height="12"
              className="font-semibold"
            />
            <ButtonBase className="text-primary-main font-medium underline">
              Download CSV template
            </ButtonBase>{" "}
            <Typography className="text-neutral-500">
              to see an example of the format required
            </Typography>
          </div>

          {!formik.values.file && (
            <Fragment>
              <div className="w-full mt-6">
                <Divider>
                  <Typography
                    className="text-neutral-500 font-medium"
                    variant="caption"
                  >
                    Or
                  </Typography>
                </Divider>
              </div>

              <div className="flex justify-center mt-6">
                <Button variant="soft">Add recipient manually</Button>
              </div>
            </Fragment>
          )}
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-end">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            Upload & Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
