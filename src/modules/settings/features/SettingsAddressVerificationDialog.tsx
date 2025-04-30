import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { SettingsAddressValues } from "../types/settings-address-state";
import { lookupApi } from "apis/lookup";
import { merchantApi } from "apis/merchant";
import useAuthUser from "hooks/use-auth-user";

type SettingsAddressVerificationDialogProps = {
  onClose: () => void;
  addressDetails: {
    street: string;
    nearestLandMark: string;
    address: string;
    state_id: string;
    city: string;
    lga_id: string;
    lga_name: string;
    state_name: string;
    country_id: number;
    country_name: string;
    postalCode: string;
  };
  reFetchAddressDetails: () => void;
} & DialogProps;

const SettingsAddressVerificationDialog = (
  props: SettingsAddressVerificationDialogProps
) => {
  const { onClose, addressDetails, reFetchAddressDetails, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthUser();

  const [addBusinessAddress] =
    merchantApi.useAddMerchantAddressDetailsMutation();
  const [updateBusinessAddress] =
    merchantApi.useUpDateMerchantAddressDetailsMutation();
  const formik = useFormik<SettingsAddressValues>({
    initialValues: {
      address: addressDetails?.address || "",
      street: addressDetails?.street || "",
      nearestLandmark: addressDetails?.nearestLandMark || "",
      city: addressDetails?.city || "",
      state: addressDetails?.state_id || "",
      lga: addressDetails?.lga_id || "",
      postalCode: addressDetails?.postalCode || "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      address: yup.string().label("Address").required(),
      street: yup.string().label("Street").required(),
      nearestLandmark: yup.string().label("Nearest Landmark"),
      city: yup.string().label("City"),
      state: yup.string().label("State").required(),
      lga: yup.string().label("Local government").required(),
      postalCode: yup
        .string()
        .label("Postal Code")
        .matches(/^[0-9\b]+$/, "Enter a valid postal code"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          body: { ...values },
          path: {
            rcNumber: user?.info?.businesses[0]?.rcNumber,
          },
        };
        const response = addressDetails?.street
          ? await updateBusinessAddress(payload).unwrap()
          : await addBusinessAddress(payload).unwrap();
        reFetchAddressDetails();
        onClose();
        enqueueSnackbar(response?.message || "Address updated successfully", {
          variant: "success",
        });
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to process ", {
          variant: "error",
        });
      }
    },
  });
  const allStatesQuery = lookupApi.useStateAddressLookupQuery({});
  const lgasQuery = lookupApi.useStateAddressLookupQuery(
    {
      path: { stateId: formik?.values?.state },
    },
    {
      skip: !formik.values.state,
    }
  );

  const allStatesList = allStatesQuery?.data?.data;
  const allLGAForStateList = lgasQuery?.data?.data;

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
          Address verification
        </Typography>
      </DialogTitleXCloseButton>
      <Divider />
      <DialogContent className="px-6">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            fullWidth
            select
            label="State"
            placeholder="Select state"
            {...getTextFieldProps(formik, "state")}
          >
            {allStatesList?.map((opt, key) => (
              <MenuItem key={key} value={opt?.cba_id}>
                {opt?.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Local government"
            placeholder="Select local government"
            {...getTextFieldProps(formik, "lga")}
          >
            {allLGAForStateList?.map((opt, key) => (
              <MenuItem key={key} value={opt?.cba_id}>
                {opt?.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Address"
            className="col-span-2"
            placeholder="Enter your address"
            {...getTextFieldProps(formik, "address")}
          />
          <TextField
            fullWidth
            label="Street"
            placeholder="Enter the name of your street"
            className="col-span-2"
            {...getTextFieldProps(formik, "street")}
          />

          <TextField
            fullWidth
            label="Nearest Landmark"
            className="col-span-2"
            placeholder="Enter the nearest landmark"
            {...getTextFieldProps(formik, "nearestLandmark")}
          />

          <TextField
            fullWidth
            label="City"
            placeholder="Enter the name of your city"
            {...getTextFieldProps(formik, "city")}
          />

          <TextField
            fullWidth
            label="Postal Code"
            placeholder="Enter your postal code"
            {...getTextFieldProps(formik, "postalCode")}
          />
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

export default SettingsAddressVerificationDialog;
