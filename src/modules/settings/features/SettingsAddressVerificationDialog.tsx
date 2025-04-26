import {
  Dialog,
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
} & DialogProps;

const SettingsAddressVerificationDialog = (
  props: SettingsAddressVerificationDialogProps
) => {
  const { onClose, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthUser();

  const [updateBusinessAddress] =
    merchantApi.useMerchantAddressDetailsMutation();

  const formik = useFormik<SettingsAddressValues>({
    initialValues: {
      address: "",
      street: "",
      nearestLandmark: "",
      city: "",
      state: "",
      lga: "",
      postalCode: "",
    },
    validateOnBlur: true,
    validationSchema: yup.object().shape({
      address: yup.string().label("Address").required(),
      street: yup.string().label("Street").required(),
      nearestLandmark: yup.string().label("Nearest Landmark").required(),
      city: yup.string().label("City").required(),
      state: yup.string().label("State").required(),
      lga: yup.string().label("Local government").required(),
      postalCode: yup.string().label("Postal Code").required(),
    }),
    onSubmit: async (values) => {
      try {
        const data = await updateBusinessAddress({
          body: { ...values },
          path: {
            rcNumber: user?.info?.businesses[0]?.rcNumber,
          },
        }).unwrap();
        onClose();
        enqueueSnackbar(data?.message || "Address updated successfully", {
          variant: "success",
        });
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || "Failed to process ", {
          variant: "error",
        });
      }
    },
  });
  const allStatesQuery = lookupApi.useStateAddressLookupQuery(
    {},
    { skip: !!formik.values.state } // skip if a state is selected
  );

  const lgasQuery = lookupApi.useStateAddressLookupQuery(
    {
      path: { stateId: formik?.values?.state },
    },
    {
      skip: !formik.values.state, // skip until stateId is selected
    }
  );

  const allStatesList = allStatesQuery?.data?.data;
  const allLGAForStateList = lgasQuery?.data?.data;
  // console.log({ getState });
  return (
    <Dialog fullWidth maxWidth="sm" {...rest}>
      <form onSubmit={formik.handleSubmit as any} className=" ">
        <DialogTitleXCloseButton onClose={onClose} className="text-center mt-3">
          <Typography variant="h5" className="font-semibold text-start">
            Address verification
          </Typography>
        </DialogTitleXCloseButton>
        <Divider />

        <div className="px-6 mt-4">
          {/* <Typography className="font-medium text-lg text-neutral-700">
            Street Address
          </Typography> */}
          {/* <div className=" mt-2">
            <Typography className="border border-neutral-200 text-neutral-900 rounded-xl py-2 px-3 font-medium ml-1">
              21, Savage Street, Ikoyi, Lagos
            </Typography>
          </div> */}

          <TextField
            className=" "
            fullWidth
            select
            label="States"
            placeholder="Select state"
            {...getTextFieldProps(formik, "state")}
          >
            {allStatesList?.map((opt, key) => (
              <MenuItem key={key} value={opt?.id}>
                {opt?.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            className="mt-4 "
            fullWidth
            select
            label="Local government"
            placeholder="Select local government"
            {...getTextFieldProps(formik, "lga")}
          >
            {allLGAForStateList?.map((opt, key) => (
              <MenuItem key={key} value={opt?.id}>
                {opt?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Street"
            placeholder="Enter the name of your street"
            {...getTextFieldProps(formik, "street")}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            placeholder="Enter your address"
            {...getTextFieldProps(formik, "address")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="City"
            placeholder="Enter the name of your city"
            {...getTextFieldProps(formik, "city")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Nearest Landmark"
            placeholder="Enter the nearest landmark"
            {...getTextFieldProps(formik, "nearestLandmark")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Postal Code"
            placeholder="Enter your postal code"
            {...getTextFieldProps(formik, "postalCode")}
          />
        </div>

        <Divider className="py-3" />
        <div className="sticky bottom-0 p-6 flex ml-auto">
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            className="flex ml-auto px-10 "
          >
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </Dialog>
  );
};

export default SettingsAddressVerificationDialog;
