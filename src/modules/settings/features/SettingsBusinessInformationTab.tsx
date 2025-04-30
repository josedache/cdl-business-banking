import {
  Button,
  ButtonBase,
  Card,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import Dropzone from "react-dropzone";
import { enqueueSnackbar } from "notistack";
import useToggle from "hooks/use-toggle";
import SettingsDirectorProfileDialog from "./SettingsDirectorProfileDialog";
import SettingsAddressVerificationDialog from "./SettingsAddressVerificationDialog";
import useAuthUser from "hooks/use-auth-user";
import isKycCheckCompleted from "utils/function/is-kyc-check-completed";
import CircularProgressWithLabel from "components/CircularProgress";
import SetUpBgImg from "assets/imgs/setup-bg.png";
import getKycVerificationPercentage from "utils/function/get-kyc-verification-percentage";
import { merchantApi } from "apis/merchant";
import DashboardAccountSetupDialog from "modules/dashboard/features/DashboardAccountSetupDialog";
import SettingsEditAndUploadMemorandum from "./SettingsEditAndUploadMemorandum";

const SettingsBusinessInformationTab = () => {
  const user = useAuthUser();
  const isKycCompleted = isKycCheckCompleted(user?.info);
  const [isAccountSetup, toggleAccountSetup] = useToggle();
  const verificationPercentage = getKycVerificationPercentage(user?.info);
  const businessRcNumber = user?.info?.businesses[0]?.rcNumber;

  const getBusinessProfile = merchantApi.useGetMerchantBusinessProfileQuery(
    {
      params: {
        rcNumber: businessRcNumber,
      },
    },
    { skip: !businessRcNumber }
  );

  const getBusinessAddress = merchantApi.useGetMerchantAddressDetailsQuery(
    {
      path: {
        rcNumber: businessRcNumber,
      },
    },
    { skip: !businessRcNumber }
  );

  const getBusinessDirectors = merchantApi.useGetMerchantBusinessDirectorsQuery(
    {
      path: {
        rcNumber: businessRcNumber,
      },
    },
    { skip: !businessRcNumber }
  );

  const getMemorandumDocument =
    merchantApi.useGetMerchantMemorandumDocumentQuery(
      {
        path: {
          rcNumber: businessRcNumber,
        },
      },
      { skip: !businessRcNumber }
    );

  const businessDetails = getBusinessProfile?.data?.data?.business;
  const businessDirectors = getBusinessDirectors?.data;

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

  const [
    openEditAndAddUploadMemorandumDialog,
    toggleEditAndAddUploadMemorandumDialog,
    setOpenEditAndAddUploadMemorandumDialog,
  ] = useToggle();

  const businessInfo = [
    {
      title: "Business Name",
      value: `${businessDetails?.name ?? "N/A"}`,
      canEdit: false,
      onClick: () => {},
    },
    {
      title: "Business Type",
      value: `${businessDetails?.businessType ?? "N/A"}`,
      canEdit: false,
      onClick: () => {},
    },
    {
      title: "Business Registration",
      value: `${businessDetails?.registrationType ?? "N/A"}`,
      canEdit: false,
      onClick: () => {},
    },
    {
      title: "Business Email",
      value: " N/A",
      canEdit: false,
      onClick: () => {},
    },
    {
      title: "Logo",
      value: (
        <>
          <ButtonBase className="bg-neutral-200 rounded-full p-5 mt-2">
            <Iconify
              fontSize={26}
              icon="hugeicons:building-03"
              className="cursor-pointer text-neutral-800"
            />
          </ButtonBase>
        </>
      ),
      canEdit: false,
      onClick: (
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
          {({ getRootProps }) => (
            <div {...getRootProps()} className="ml-auto cursor-pointer">
              {/* <input {...getInputProps()} /> */}
              <Typography className="text-primary-main/25 font-semibold cursor-pointer">
                Edit
              </Typography>
            </div>
          )}
        </Dropzone>
      ),
    },
  ];

  const complianceInfo = [
    {
      title: "Directors",
      value: (
        <Typography className="mt-1 text-neutral-500 font-medium">
          {businessDirectors?.data?.length ?? "0"}{" "}
          {(businessDirectors?.data?.length ?? 0) > 1
            ? "Directors"
            : "Director"}{" "}
          Listed
        </Typography>
      ),
      isLoading: getBusinessDirectors?.isLoading,
      canEdit: (businessDirectors?.data?.length ?? 0) > 0,
      onClick: () => {
        setOpenDirectorsProfileDialog(true);
      },
      isValueAvailable: (businessDirectors?.data?.length ?? 0) > 0,
    },
    {
      title: "Address Verification",
      isLoading: getBusinessAddress?.isLoading,
      value: (
        <Chip
          label={
            <Typography className="flex items-center gap-1 ">
              Verified
              <Iconify
                icon="material-symbols:check-circle-outline-rounded"
                fontSize={16}
                className="text-success-800"
              />
            </Typography>
          }
          color="success"
          className="bg-success-100 text-success-800 font-medium rounded-lg mt-2"
        />
      ),
      canEdit: Boolean(businessRcNumber),
      onClick: () => {
        setOpenAddressVerificationDialog(true);
      },
      isValueAvailable: getBusinessAddress?.data?.data,
    },
    {
      title: "MEMAT (Memorandum of articles of association)",
      isLoading: getMemorandumDocument?.isLoading,
      value: (
        <>
          {getMemorandumDocument?.isLoading ? (
            <Skeleton variant="text" className="w-22 h-8" />
          ) : (
            <Chip
              label={
                <Typography className="flex items-center gap-1 ">
                  Submitted
                  <Iconify
                    icon="material-symbols:check-circle-outline-rounded"
                    fontSize={16}
                    className="text-success-800"
                  />
                </Typography>
              }
              color="success"
              className="bg-success-100 text-success-800 font-medium rounded-lg mt-2"
            />
          )}
        </>
      ),
      canEdit: Boolean(businessRcNumber),
      onClick: () => {
        setOpenEditAndAddUploadMemorandumDialog(true);
      },
      isValueAvailable: getMemorandumDocument?.data?.data,
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

  //     enqueueSnackbar(message || "Failed to update selfie", {
  //       variant: "error",
  //     });
  //   }
  // }

  return (
    <div className="grid xl:grid-cols-5 gap-6">
      <Paper className="xl:col-span-3 mt-6" elevation={0}>
        <div className="py-6 px-10 ">
          <Typography variant="h6" className="font-semibold">
            Business Information
          </Typography>
          <div className="space-y-3 mt-4">
            {businessInfo?.map((opt, index) => {
              return (
                <div key={index} className="flex justify-between items-center">
                  <div className="py-1">
                    <Typography className="font-medium text-neutral-900">
                      {opt.title}
                    </Typography>
                    {getBusinessProfile.isLoading ? (
                      <Skeleton variant="text" className="w-22 h-8" />
                    ) : opt.value === typeof String ? (
                      <Typography className="text-neutral-500 capitalize">
                        {opt.value}
                      </Typography>
                    ) : (
                      <>{opt.value}</>
                    )}
                  </div>

                  {typeof opt.onClick !== "function" ? (
                    opt.onClick
                  ) : (
                    <Typography
                      className={`font-semibold  ${opt.canEdit ? "text-primary-main cursor-pointer" : " text-primary-main/25"}`}
                      onClick={() => {
                        if (opt.canEdit && typeof opt.onClick === "function") {
                          opt.onClick?.();
                        }
                      }}
                    >
                      Edit
                    </Typography>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Divider />

        <div className="py-6 px-10">
          <Typography className="font-semibold">Compliance</Typography>
          <div className="space-y-3 mt-4">
            {complianceInfo?.map((opt, index) => {
              return (
                <div key={index} className="flex justify-between items-center">
                  <div className="py-1">
                    <Typography className="font-medium text-neutral-900">
                      {opt.title}
                    </Typography>
                    {opt?.isLoading ? (
                      <Skeleton variant="text" className="w-22 h-8" />
                    ) : (
                      <>
                        {opt?.isValueAvailable ? (
                          opt.value
                        ) : (
                          <div className="flex items-center gap-1">
                            <ButtonBase>
                              <Iconify
                                fontSize={16}
                                icon="solar:danger-triangle-outline"
                                className=" text-neutral-500 "
                              />
                            </ButtonBase>
                            <span className="text-neutral-500 font-medium">
                              Not Set
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <Typography
                    className={`font-semibold ${opt.canEdit ? "cursor-pointer text-primary-main " : " text-primary-main/25"}`}
                    onClick={opt.canEdit && opt.onClick}
                  >
                    Edit
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
      </Paper>
      <div className="xl:col-span-2">
        {!isKycCompleted ? (
          <Card
            elevation={0}
            sx={{
              backgroundImage: `url(${SetUpBgImg}), linear-gradient(112deg, #353D4A 40.01%, #737882 92.86%)`,
              backgroundPosition: "right center",
              backgroundOrigin: "border-box",
              backgroundRepeat: "no-repeat",
              backgroundSize: "",
              borderRadius: "16px",
            }}
            className="flex flex-col flex-wrap gap-4 p-6 mt-6"
          >
            <div className="flex items-center gap-4 ">
              <div>
                <CircularProgressWithLabel
                  value={verificationPercentage || 0}
                />
              </div>
              <div>
                <Typography variant="h6" className="font-semibold text-white">
                  You are almost done
                </Typography>
                <Typography className="text-white max-w-[407px]">
                  Give us more information on your business to unlock higher
                  transaction limits
                </Typography>
              </div>
            </div>

            <div className="w-full">
              <Button
                onClick={toggleAccountSetup}
                fullWidth
                size="large"
                variant="gradient"
                className="font-semibold"
              >
                Complete Compliance
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
      {openDirectorsProfileDialog && (
        <SettingsDirectorProfileDialog
          directorsList={businessDirectors?.data}
          open={openDirectorsProfileDialog}
          onClose={toggleDirectorsProfileDialog}
        />
      )}
      {openAddressVerificationDialog && (
        <SettingsAddressVerificationDialog
          open={openAddressVerificationDialog}
          onClose={toggleAddressVerificationDialog}
          addressDetails={getBusinessAddress?.data?.data}
          reFetchAddressDetails={getBusinessAddress.refetch}
        />
      )}

      {openEditAndAddUploadMemorandumDialog && (
        <SettingsEditAndUploadMemorandum
          open={openEditAndAddUploadMemorandumDialog}
          onClose={toggleEditAndAddUploadMemorandumDialog}
          memorandumDocuments={getMemorandumDocument?.data?.data}
        />
      )}
      {isAccountSetup && (
        <DashboardAccountSetupDialog
          open={isAccountSetup}
          onClose={toggleAccountSetup}
        />
      )}
    </div>
  );
};

export default SettingsBusinessInformationTab;
