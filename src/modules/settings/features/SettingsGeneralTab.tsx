import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { ButtonBase, Divider, Paper, Typography } from "@mui/material";
import SettingsEditEmailDialog from "./SettingsEditEmailDialog";
import useToggle from "hooks/use-toggle";
import Dropzone from "react-dropzone";
import { useSnackbar } from "notistack";
import useAuthUser from "hooks/use-auth-user";
import useClipboard from "hooks/use-clipboard";

const SettingsGeneralTab = () => {
  const authUser = useAuthUser();
  const { enqueueSnackbar } = useSnackbar();
  const [openEditEmailDialog, toggleEditEmailDialog, setOpenEditEmailDialog] =
    useToggle();
  const clipboard = useClipboard();

  const personalInfo = [
    {
      title: "Full Name",
      value: `${authUser?.info?.firstName ?? "N/A"} ${authUser?.info?.lastName ?? ""}`,
      canEdit: false,
      onClick: () => {},
    },
    {
      title: "Email Address",
      value: `${authUser?.info?.email ?? "N/A"} `,
      canEdit: authUser?.info?.isEmailVerified,
      onClick: () => {
        setOpenEditEmailDialog(true);
      },
    },
    {
      title: "Phone Number",
      value: `${authUser?.info?.phone ?? "N/A"} `,
      canEdit: false,
      onClick: () => {},
    },
    {
      title: "Address",
      value: " N/A",
      canEdit: false,
      onClick: () => {},
    },
  ];

  const identification = [
    {
      title: "NIN",
      onClick: () => {},
      canEdit: authUser?.info?.isNinVerified,
    },
    {
      title: "BVN",
      value: "",
      onClick: () => {},
      canEdit: authUser?.info?.isBvnVerified,
    },
    {
      title: "ID Card",
      value: " “”ID Card Type Here”” ",
      onClick: () => {},
      canEdit: false,
    },
  ];

  const referralDetails = [
    {
      title: "Referral Code",
      value: ` ${authUser?.info?.referralCode ?? "N/A"}`,
    },
    {
      title: "Referral Link",
      value: `${window.location.origin}?referral_code=${authUser?.info?.referralCode}`,
    },
  ];

  // async function handleSelfieUpdate(file: File) {
  //   try {
  //     // const assetInfo = getAssetInfo(file);
  //     // const data = await uploadUserFileMutation({
  //     //   body: {
  //     //     file: file,
  //     //     tier_level: authUser.kycLevel,
  //     //     title: file.name,
  //     //     type: "selfie",
  //     //     fileExtension: assetInfo.type,
  //     //     mimeType: assetInfo.mimeType,
  //     //   },
  //     // }).unwrap();
  //     // enqueueSnackbar(data?.message || "Selfied updated successfully!", {
  //     //   variant: "success",
  //     // });
  //   } catch (error) {
  //     const message = Array.isArray(error?.data?.message)
  //       ? error?.data?.message?.[0]
  //       : error?.data?.message;
  //
  //     enqueueSnackbar(message || "Failed to update selfie", {
  //       variant: "error",
  //     });
  //   }
  // }

  return (
    <div className="grid xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <Paper className="py-5 mt-6 " elevation={0}>
          <div className="flex items-center mb-6 px-10 ">
            <ButtonBase className="rounded-full p-5 bg-gray-500">
              <Iconify
                icon="mingcute:user-3-fill"
                fontSize={48}
                className=" text-white"
              />
            </ButtonBase>

            <div className="ml-6 ">
              <Typography
                variant="h6"
                className="font-semibold text-neutral-800 capitalize"
              >
                {`${authUser?.info?.firstName ?? "N/A"} ${authUser?.info?.lastName ?? ""}`}
              </Typography>
              <Typography className="font-medium text-neutral-500 ">
                {`${authUser?.info?.email ?? "N/A"} `}
              </Typography>
            </div>
            <Dropzone
              multiple={false}
              maxSize={1024 * 1024 * 2}
              accept={{ "image/*": [] }}
              // onDropAccepted={(files) => {
              //   const file = files[0];
              //   handleSelfieUpdate(file);
              // }}
              onDropRejected={(fileRejection) => {
                enqueueSnackbar(
                  fileRejection[0].errors?.[0].message || "File Rejected",
                  { variant: "error" }
                );
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="ml-auto cursor-pointer">
                  <input {...getInputProps()} />
                  <Typography className="text-primary-main font-semibold cursor-pointer">
                    Edit Photo
                  </Typography>
                </div>
              )}
            </Dropzone>
          </div>
          <Divider />
          <div className="mt-6 px-10 ">
            <Typography className="font-semibold">Personal Info</Typography>
            <div className="space-y-3 mt-4">
              {personalInfo?.map((opt, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="py-1">
                      <Typography className="font-medium text-neutral-900">
                        {opt.title}
                      </Typography>
                      <Typography className=" text-neutral-500">
                        {opt.value}
                      </Typography>
                    </div>
                    <Typography
                      className={`font-semibold ${opt.canEdit ? "text-primary-main cursor-pointer " : " text-primary-main/25"}`}
                      onClick={opt.onClick}
                    >
                      Edit
                    </Typography>
                  </div>
                );
              })}
            </div>
          </div>
          <Divider className="mt-6" />
          <div className="mt-6 px-10 ">
            <Typography className="font-semibold">Identification</Typography>
            <div className="space-y-3 mt-4">
              {identification?.map((opt, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="py-1">
                      <Typography className="font-medium text-neutral-900">
                        {opt.title}
                      </Typography>
                      <Typography className=" text-neutral-500">
                        {opt.value}
                      </Typography>
                    </div>
                    {!opt.canEdit ? (
                      <Typography
                        className="text-primary-main font-semibold"
                        onClick={opt.onClick}
                      >
                        Edit
                      </Typography>
                    ) : (
                      <Typography className="flex items-center gap-1 text-success-800 bg-success-100 text-sm py-2 px-3 font-medium">
                        Verified
                        <Iconify
                          icon="material-symbols:check-circle-outline-rounded"
                          fontSize={16}
                          className="text-success-900"
                        />
                      </Typography>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Paper>
      </div>

      <div className="xl:col-span-2">
        <Paper className="py-6 mt-6 " elevation={0}>
          <div className="mb-6 px-10">
            <Typography className="font-semibold text-gray-800 text-lg">
              Refer a Friend Both Earn X amount
            </Typography>
            <Typography className=" text-gray-500 text-sm mt-4">
              Refer others to deposit over N200, and both receive N1000.
            </Typography>
          </div>

          <Divider />
          <div className="mt-6 px-10">
            <Typography className="font-medium">Invite Via</Typography>
            <div className="flex flex-col items-center">
              {referralDetails.map((opt, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 w-full py-3 px-4 mt-2 border border-neutral-200  rounded-lg "
                  >
                    <Typography className="text-neutral-700" noWrap>
                      {opt.title}
                    </Typography>

                    <div className="flex gap-1 justify-end">
                      <Typography
                        className="font-medium text-neutral-800"
                        noWrap
                      >
                        {opt.value}
                      </Typography>

                      <ButtonBase
                        onClick={() => clipboard.writeText(String(opt.value))}
                      >
                        <Iconify
                          fontSize={18}
                          icon="solar:copy-bold"
                          className="cursor-pointer text-neutral-300 hover:text-primary-main"
                        />
                      </ButtonBase>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Paper>
      </div>

      {openEditEmailDialog && (
        <SettingsEditEmailDialog
          open={openEditEmailDialog}
          onClose={toggleEditEmailDialog}
        />
      )}
    </div>
  );
};

export default SettingsGeneralTab;
