import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import Dropzone from "react-dropzone";
import { enqueueSnackbar } from "notistack";
import useToggle from "hooks/use-toggle";
import SettingsDirectorProfileDialog from "./SettingsDirectorProfileDialog";
import SettingsAddressVerificationDialog from "./SettingsAddressVerificationDialog";

const SettingsBusinessInformationTab = () => {
  const [
    openDirectorsProfileDialog,
    toggleDirectorsProfileDialog,
    setOpenDirectorsProfileDialog,
  ] = useToggle();

  const [
    openAddressVerificationDialog,
    toggleAddressVerificationDialog,
    setOpenAddressVerificationDialog,
  ] = useToggle();

  const businessInfo = [
    {
      title: "Business Name",
      value: "Segun Akinnibosun",
      canEdit: true,
      onClick: () => {},
    },
    {
      title: "Business Type",
      value: "Product based Business",
      canEdit: true,
      onClick: () => {},
    },
    {
      title: "Business Registration",
      value: "Private Limited Liability Company",
      canEdit: true,
      onClick: () => {},
    },
    {
      title: "Business Email",
      value: "SegunAkinnibosun@gmail.com",
      canEdit: true,
      onClick: () => {},
    },
    {
      title: "Logo",
      value: "",
      canEdit: true,
      onClick: () => {},
    },
  ];

  const complianceInfo = [
    {
      title: "Directors",
      value: "2 Directors Listed",
      canEdit: true,
      onClick: () => {
        setOpenDirectorsProfileDialog(true);
      },
    },
    {
      title: "Address Verification",
      value: "Product based Business",
      canEdit: true,
      onClick: () => { setOpenAddressVerificationDialog(true)},
    },
    {
      title: "MEMAT (Memorandum of articicles of association)",
      value: " “”ID Card Type Here”” ",
      canEdit: true,
      onClick: () => {},
    },
  ];

  async function handleSelfieUpdate(file: File) {
    try {
      // const assetInfo = getAssetInfo(file);
      // const data = await uploadUserFileMutation({
      //   body: {
      //     file: file,
      //     tier_level: authUser.kycLevel,
      //     title: file.name,
      //     type: "selfie",
      //     fileExtension: assetInfo.type,
      //     mimeType: assetInfo.mimeType,
      //   },
      // }).unwrap();
      // enqueueSnackbar(data?.message || "Selfied updated successfully!", {
      //   variant: "success",
      // });
    } catch (error) {
      const message = Array.isArray(error?.data?.message)
        ? error?.data?.message?.[0]
        : error?.data?.message;

      enqueueSnackbar(message || "Failed to update selfie", {
        variant: "error",
      });
    }
  }

  return (
    <div className="grid xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <Paper className="py-6 px-10 mt-6 ">
          <Typography className="font-semibold">
            Business Information
          </Typography>
          <div className="space-y-3 mt-4">
            {businessInfo?.map((opt, index) => {
              return (
                <div className="flex justify-between items-center">
                  <div key={index} className="py-1">
                    <Typography className="font-medium text-neutral-900">
                      {opt.title}
                    </Typography>

                    {opt.title === "Logo" ? (
                      <ButtonBase className="bg-neutral-200 rounded-full p-5 mt-2">
                        <Iconify
                          fontSize={30}
                          icon="hugeicons:building-03"
                          className="cursor-pointer text-neutral-800"
                        />
                      </ButtonBase>
                    ) : (
                      <Typography className=" text-neutral-500">
                        {opt.value}
                      </Typography>
                    )}
                  </div>
                  {opt.title === "Logo" ? (
                    <Dropzone
                      multiple={false}
                      maxSize={1024 * 1024 * 2}
                      accept={{ "image/*": [] }}
                      onDropAccepted={(files) => {
                        const file = files[0];
                        handleSelfieUpdate(file);
                      }}
                      onDropRejected={(fileRejection) => {
                        enqueueSnackbar(
                          fileRejection[0].errors?.[0].message ||
                            "File Rejected",
                          { variant: "error" }
                        );
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className="ml-auto cursor-pointer"
                        >
                          <input {...getInputProps()} />
                          <Typography className="text-primary-main font-semibold cursor-pointer">
                            Edit
                          </Typography>
                        </div>
                      )}
                    </Dropzone>
                  ) : (
                    <Typography
                      className={`font-semibold  ${opt.canEdit ? "text-primary-main cursor-pointer" : " text-primary-main/25"}`}
                      onClick={() => {
                        opt.onClick?.();
                      }}
                    >
                      Edit
                    </Typography>
                  )}
                </div>
              );
            })}
          </div>
        </Paper>

        <Divider />

        <Paper className="py-6 px-10">
          <Typography className="font-semibold">Compliance</Typography>
          <div className="space-y-3 mt-4">
            {complianceInfo?.map((opt, index) => {
              return (
                <div className="flex justify-between items-center">
                  <div key={index} className="py-1">
                    <Typography className="font-medium text-neutral-900">
                      {opt.title}
                    </Typography>
                    <Typography className=" text-neutral-500">
                      {opt.value}
                    </Typography>
                  </div>
                  <Typography
                    className={`font-semibold ${opt.canEdit ? "cursor-pointer text-primary-main " : " text-primary-main/25"}`}
                    onClick={() => {
                      opt.onClick?.();
                    }}
                  >
                    Edit
                  </Typography>
                </div>
              );
            })}
          </div>
        </Paper>
      </div>
      {openDirectorsProfileDialog && (
        <SettingsDirectorProfileDialog
          open={openDirectorsProfileDialog}
          onClose={toggleDirectorsProfileDialog}
        />
      )}

{openAddressVerificationDialog && (
        <SettingsAddressVerificationDialog
          open={openAddressVerificationDialog}
          onClose={toggleAddressVerificationDialog}
        />
      )}
    </div>
  );
};

export default SettingsBusinessInformationTab;
