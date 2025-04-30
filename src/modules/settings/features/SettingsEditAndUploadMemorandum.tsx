import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useDropzone } from "react-dropzone";
import { SettingsEditAndUploadMemorandumValues } from "../types/settings-add-upload-memorandum";
import { uploadApi } from "apis/upload";
import useAuthUser from "hooks/use-auth-user";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";

type SettingsEditAndUploadMemorandumDialogProps = {
  onClose: () => void;
  memorandumDocuments: [
    {
      id: number;
      parentEntityType: string;
      parentEntityId: number;
      name: string;
      fileName: string;
      size: number;
      type: string;
      location: string;
      description: string;
    },
  ];
} & DialogProps;

const SettingsEditAndUploadMemorandum = (
  props: SettingsEditAndUploadMemorandumDialogProps
) => {
  const { onClose, memorandumDocuments, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthUser();
  const businessRcNumber = user?.info?.businesses[0]?.rcNumber;
  const [uploadMemorandumFileMutation] =
    uploadApi.useMemorandumUploadMutation();

  const formik = useFormik<SettingsEditAndUploadMemorandumValues>({
    initialValues: {
      file: memorandumDocuments?.[0]?.location || "",
      fileName: memorandumDocuments?.[0]?.fileName || "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      file: yup.string().label("File").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await uploadMemorandumFileMutation({
          body: {
            file: values.file,
            uploadFileType: "Memat",
            description: "Memorandum & Article of association",
            rcNumber: businessRcNumber,
          },
        }).unwrap();
        onClose();
        enqueueSnackbar(
          response?.message || "Memorandum uploaded successfully",
          {
            variant: "success",
          }
        );
      } catch (error: any) {
        enqueueSnackbar(
          error?.data?.message || "Failed to upload memorandum ",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const dropzone = useDropzone({
    multiple: false,
    accept: { "application/pdf": [], "image/*": [] },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024, // 3MB
    onDropAccepted: async (files) => {
      try {
        const file = files[0];
        await formik.setFieldValue("file", file);
        formik.setFieldValue("fileName", file?.name);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
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
    <Dialog
      fullWidth
      maxWidth="sm"
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
      {...rest}
    >
      <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
        <Typography variant="h5" className="font-semibold text-start">
          Edit Memorandum
        </Typography>
      </DialogTitleXCloseButton>
      <Divider />
      <DialogContent className="p-0 h-full min-h-[289px]">
        <div className="px-6 py-4">
          <Typography className="font-semibold text-base text-neutral-600">
            Memorandum & Article of association
          </Typography>{" "}
          {formik.values.file ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 bg-neutral-50 px-6 py-9 border border-dashed border-neutral-200 rounded-xl">
                <Icon icon="lets-icons:file-dock" width="20" height="20" />
                <Typography
                  noWrap
                  className="text-gray-700  font-medium cursor-pointer "
                >
                  {(formik.values.file as unknown as File)?.name}
                  {formik.values.fileName}
                </Typography>
              </div>
            </div>
          ) : (
            <div className="mt-4" {...dropzone.getRootProps()}>
              <input {...dropzone.getInputProps()} />
              <div
                className={clsx(
                  formik?.errors?.file
                    ? "border-red-500 "
                    : "border-neutral-200",
                  "flex items-center gap-2 bg-neutral-50 px-6 py-9  border border-dashed  rounded-xl"
                )}
              >
                <Icon icon="lets-icons:file-dock" width="20" height="20" />
                {formik.values.fileName ? (
                  <Typography className=" text-gray-700 font-medium cursor-pointer ">
                    {formik.values.fileName}
                  </Typography>
                ) : (
                  <Typography className="text-gray-700 font-medium cursor-pointer ">
                    Click to upload file
                  </Typography>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <Divider />
      <DialogActions className="px-6 py-5">
        <LoadingButton
          variant="gradient"
          type="submit"
          size="large"
          loading={formik.isSubmitting}
          loadingPosition="end"
          className="flex ml-auto"
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsEditAndUploadMemorandum;
