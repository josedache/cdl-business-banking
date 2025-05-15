import {
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
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
  SettingsDirectorProfileFormikValues,
} from "../types/settings-director-profile";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { SettingsDirectorssProfileStep } from "../enums/settings-directos-profile-step";
import useStepper from "hooks/use-stepper";
import { merchantApi } from "apis/merchant";
import useAuthUser from "hooks/use-auth-user";
import COUNTRIES from "../constants/settings-countries";
import splitPhoneNumber from "utils/phone/split-phone-number";
import SettingsDirectorList from "./SettingsDirectorList";
import SettingsEditDirectorsForm from "./SettingsEditDirectorsForm";

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

  const formik = useFormik<SettingsDirectorProfileFormikValues>({
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
        <SettingsDirectorList
          directorsList={directorsList}
          reInitializeFormikValues={reInitializeFormikValues}
        />
      ),
    },
    {
      title: "Edit Director’s details",
      content: (
        <SettingsEditDirectorsForm
          formik={formik}
          selectedCode={selectedCode}
          setSelectedCode={setSelectedCode}
          isPoliticallyExposed={isPoliticallyExposed}
          setIsPoliticallyExposed={setIsPoliticallyExposed}
          ownsMoreThanFivePercent={ownsMoreThanFivePercent}
          setOwnsMoreThanFivePercent={setOwnsMoreThanFivePercent}
        />
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
