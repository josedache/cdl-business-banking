import {
  Avatar,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

import {
  Director,
  SettingsDirectorProfileValues,
} from "../types/settings-director-profile";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { SettingsDirectorssProfileStep } from "../enums/settings-directos-profile-step";
import useStepper from "hooks/use-stepper";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { merchantApi } from "apis/merchant";
import useAuthUser from "hooks/use-auth-user";
import COUNTRIES from "../constants/settings-countries";
import splitPhoneNumber from "utils/phone/split-phone-number";

type SettingsDirectorProfileDialogProps = {
  onClose: () => void;
  directorsList: Director[];
  reFetchDirectorsDetails: () => void;
} & DialogProps;

const SettingsDirectorProfileDialog = (
  props: SettingsDirectorProfileDialogProps
) => {
  const { onClose, directorsList, reFetchDirectorsDetails, ...rest } = props;

  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthUser();
  const stepper = useStepper({
    initialStep: SettingsDirectorssProfileStep.ALL_DIRECTORS_PROFILES,
  });
  const enumStep = stepper.step;

  const [selectedCode, setSelectedCode] = useState(COUNTRIES[0].code);
  const [isPoliticallyExposed, setIsPoliticallyExposed] = useState(false);
  const [ownsMoreThanFivePercent, setOwnsMoreThanFivePercent] = useState(false);

  const [submitBusinessDirectorsDetailsMutation] =
    merchantApi.useSubmitMerchantBusinessDirectorsMutation();

  const handleCountryChange = (event) => {
    const country = COUNTRIES.find((c) => c.code === event.target.value);
    setSelectedCode(country?.code || "");
    formik.setFieldValue("country", event.target.value);
  };
  const handleTogglePoliticallyExposed = (val: boolean) => {
    setIsPoliticallyExposed(val);
  };
  const handleToggleOwnsMoreThanFivePercent = (val: boolean) => {
    setOwnsMoreThanFivePercent(val);
  };

  const formik = useFormik<SettingsDirectorProfileValues>({
    initialValues: {
      bvn: "",
      userId: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      country: COUNTRIES[0].code,
      isPoliticallyExposed: isPoliticallyExposed,
      ownsMoreThanFivePercent: ownsMoreThanFivePercent,
      sharePercentage: "",
    },
    validateOnBlur: true,

    validationSchema: yup.object().shape({
      ...{
        [SettingsDirectorssProfileStep.ALL_DIRECTORS_PROFILES]: {},
        [SettingsDirectorssProfileStep.DIRECTORS_DETAILS]: {
          bvn: yup
            .string()
            .label("BVN")
            .required("Required")
            .matches(/^[0-9\b]+$/, "Enter a valid BVN")
            .min(11, "BVN is not complete")
            .max(11, "BVN is too long"),
          firstName: yup.string().label("First Name").trim().required(),
          lastName: yup.string().label("Last Name").trim().required(),
          phoneNumber: yup
            .string()
            .label("Phone Number")
            .required("Required")
            .matches(/^[0-9\b]+$/, "Enter a valid Phone number"),
          address: yup.string().label("Address").trim().required(),
          sharePercentage: yup
            .string()
            .label("Share Percentage")
            .matches(/^[0-9\b]+$/, "Enter a valid Share Percentage")
            .trim()
            .required(),
        },
      }[enumStep],
    }),
    onSubmit: async (values) => {
      try {
        switch (enumStep) {
          case SettingsDirectorssProfileStep.DIRECTORS_DETAILS: {
            const data = await submitBusinessDirectorsDetailsMutation({
              body: {
                bvn: values.bvn,
                userId: values.userId,
                street: values.address,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: `${values.country}${values.phoneNumber}`,
                isPoliticallyExposed: isPoliticallyExposed,
                ownsMoreThanFivePercent: ownsMoreThanFivePercent,
                sharePercentage: Number(values.sharePercentage),
              },
              path: {
                rcNumber: user?.info?.businesses[0]?.rcNumber,
              },
            }).unwrap();
            reFetchDirectorsDetails();
            enqueueSnackbar(
              data?.message || "Director's profile edited successfully",
              {
                variant: "success",
              }
            );
            onClose();
            break;
          }
        }
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to process", {
          variant: "error",
        });
      }
    },
  });

  const reInitializeFormikValues = (index: number) => {
    const director = directorsList[index];
    const { countryCode, phoneNumber } = splitPhoneNumber(
      director?.phone,
      COUNTRIES
    );
    formik.setValues({
      bvn: director?.bvn || "",
      firstName: director?.firstName || "",
      lastName: director?.lastName || "",
      phoneNumber: phoneNumber || "",
      address: director?.street || "",
      country: countryCode || COUNTRIES[0].code,
      isPoliticallyExposed,
      ownsMoreThanFivePercent,
      sharePercentage: director?.sharePercentage || "",
      userId: director?.id,
    });
    setSelectedCode(countryCode);
    setIsPoliticallyExposed(director?.isPoliticallyExposed);
    setOwnsMoreThanFivePercent(director?.ownsMoreThanFivePercent);
    stepper.next();
  };

  const tabs = [
    {
      title: "",
      content: (
        <div className="px-6 h-full max-h-80">
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

                  <Typography
                    onClick={() => {
                      reInitializeFormikValues(index);
                    }}
                    className="text-primary-main font-semibold cursor-pointer"
                  >
                    Edit
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Edit Director’s details",
      content: (
        <div className="px-6 mt-8">
          <TextField
            fullWidth
            label="BVN"
            placeholder="Enter their 10 digit BVN"
            {...getTextFieldProps(formik, "bvn")}
          />
          <Typography
            variant="body2"
            className="mt-1.5 text-neutral-500 font-normal"
          >
            The BVN would only be used only for identification.
          </Typography>{" "}
          <div className="bg-sky-50 px-3 py-2 mt-4">
            <Typography className="flex gap-3 items-center mt-1.5 text-neutral-600">
              <Iconify
                fontSize={22}
                icon="ph:info-fill"
                className="text-sky-500 p-0"
              />
              Why do we need your director’s BVN?{" "}
              <span className="text-neutral-800 font-semibold">See why</span>
            </Typography>{" "}
          </div>
          <TextField
            fullWidth
            label="First name"
            placeholder="Enter your First Name"
            className="mt-6"
            {...getTextFieldProps(formik, "firstName")}
          />
          <TextField
            fullWidth
            className="mt-6"
            label="Last name"
            placeholder="Enter your Last Name"
            {...getTextFieldProps(formik, "lastName")}
          />
          <div className="mt-6">
            <Typography className="font-medium text-neutral-600 text-normal mb-2">
              Phone number
            </Typography>
            <div className="flex w-full border border-neutral-200 hover:border-neutral-800 focus:border-primary-main rounded-lg ">
              <div>
                <FormControl fullWidth>
                  <Select
                    value={formik.values.country}
                    defaultValue={COUNTRIES[0].code}
                    onChange={handleCountryChange}
                    className="border-0 outline-none"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                        borderRight: "1px solid #ECECED",
                        borderRadius: "0px",
                        height: "32px",
                        marginTop: "auto",
                        marginBottom: "auto",
                      },
                    }}
                  >
                    {COUNTRIES.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        <Iconify
                          fontSize={20}
                          icon={country.icon}
                          className="text-neutral-500 p-0"
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="w-full">
                <TextField
                  fullWidth
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCode}
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <span className="text-red-600 text-xs ml-2">
              {formik?.errors?.phoneNumber}
            </span>
          </div>
          <TextField
            fullWidth
            className="mt-2"
            label="Address"
            placeholder="Enter your Address"
            {...getTextFieldProps(formik, "address")}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      fontSize={20}
                      icon="hugeicons:location-05"
                      className="text-neutral-500 p-0"
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Iconify
                        fontSize={16}
                        icon="material-symbols:help-outline-rounded"
                        className="text-neutral-500 p-0"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Typography className="mt-6 font-medium text-neutral-600">
            Is this person a Politically Exposed Person (PEP){" "}
          </Typography>{" "}
          <div className="flex gap-6 mt-4">
            <Button
              type="button"
              onClick={() => {
                handleTogglePoliticallyExposed(true);
              }}
              className={`${isPoliticallyExposed ? "border-[1.5px] border-neutral-800 font-semibold" : ""} bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold`}
            >
              Yes
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleTogglePoliticallyExposed(false);
              }}
              className={`${!isPoliticallyExposed ? "border-[1.5px] border-neutral-800 font-semibold" : ""} bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold`}
            >
              No
            </Button>
          </div>
          <Typography className="mt-6 font-medium text-neutral-600">
            Does this director own 5% or more shares in the company. If yes,
            they would be added as a shareholder
          </Typography>{" "}
          <div className="flex gap-6 mt-6">
            <Button
              type="button"
              onClick={() => {
                handleToggleOwnsMoreThanFivePercent(true);
              }}
              className={`${ownsMoreThanFivePercent ? "border-[1.5px] border-neutral-800 font-semibold" : ""} bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold`}
            >
              Yes
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleToggleOwnsMoreThanFivePercent(false);
              }}
              className={`${!ownsMoreThanFivePercent ? "border-[1.5px] border-neutral-800 font-semibold" : ""} bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold`}
            >
              No
            </Button>
          </div>
          <TextField
            fullWidth
            className="mt-6"
            label="Share holder Percentage"
            placeholder="8%"
            {...getTextFieldProps(formik, "sharePercentage")}
          />
        </div>
      ),
    },
  ];
  const isFirstStep =
    stepper.step === SettingsDirectorssProfileStep.ALL_DIRECTORS_PROFILES;
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      {...rest}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "520px",
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
        {isFirstStep ? (
          <Typography variant="h5" className="font-semibold text-start">
            Director Profiles
          </Typography>
        ) : (
          <ButtonBase
            disableRipple
            className="flex items-center gap-2"
            onClick={() => stepper.previous()}
          >
            <Iconify icon="weui:back-filled" fontSize={20} />
            <Typography>Go back</Typography>
          </ButtonBase>
        )}
      </DialogTitleXCloseButton>
      <Divider />
      <DialogContent className="px-0">
        <Typography variant="h5" className="font-semibold text-start px-6">
          {tabs[stepper.step]?.title}
        </Typography>
        {tabs[stepper.step]?.content}
      </DialogContent>
      <DialogActions className=" px-6 py-5 flex ml-auto">
        <LoadingButton
          variant="gradient"
          type="submit"
          size="large"
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
