import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  ButtonBase,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { merchantApi } from "apis/merchant";
import NumberTextField from "components/NumberTextField";
import SecuredDataBadge from "components/SecuredDataBadge";

import { getTextFieldProps } from "utils/formik/get-text-field-props";
import { DashboardAccountSetupContentProps } from "../types/DashboardStepForm";

type DashboardAccountSetupBusinessNonCacRegProps =
  {} & DashboardAccountSetupContentProps;

export default function DashboardAccountSetupBusinessNonCacReg(
  props: DashboardAccountSetupBusinessNonCacRegProps
) {
  const { formik, stepper } = props;
  const getBusinessTypeQuery = merchantApi.useGetMerchantBusinessDataQuery({
    params: {
      details_type: "Business_Type",
    },
  });

  const getBusinessSectorQuery = merchantApi.useGetMerchantBusinessDataQuery({
    params: {
      details_type: "Business_Sector",
    },
  });

  const getSubcategories =
    getBusinessSectorQuery?.data?.data?.find(
      (item) => item.key === formik.values.businessSectorParent
    )?.subcategories || [];

  return (
    <Paper className="mx-auto max-w-[600px]">
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
            Business Details
          </Typography>
          <Typography className=" text-neutral-500">
            Provide details to create your business profile
          </Typography>

          <div className="grid grid-cols-1 gap-6 mt-4">
            <TextField
              fullWidth
              label="Business Name"
              placeholder="Enter Business Name"
              {...getTextFieldProps(formik, "businessName")}
            />

            <TextField
              fullWidth
              label="Business Type"
              placeholder="Enter Business Type"
              {...getTextFieldProps(formik, "businessType")}
              select
            >
              {getBusinessTypeQuery.isLoading ? (
                <MenuItem value="" disabled>
                  Loading...
                </MenuItem>
              ) : null}
              {getBusinessTypeQuery?.data?.data?.map?.((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Business Sector"
              placeholder="Enter Business Sector"
              {...getTextFieldProps(formik, "businessSectorParent")}
              select
            >
              {getBusinessSectorQuery.isLoading ? (
                <MenuItem value="" disabled>
                  Loading...
                </MenuItem>
              ) : null}
              {getBusinessSectorQuery?.data?.data?.map?.((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Business Sector Subcategory"
              placeholder="Enter Business Sector Subcategory"
              {...getTextFieldProps(formik, "businessSector")}
              disabled={
                !formik.values.businessSectorParent ||
                getBusinessSectorQuery.isLoading
              }
              select
            >
              {getBusinessSectorQuery.isFetching ? (
                <MenuItem value="" disabled>
                  Loading...
                </MenuItem>
              ) : null}
              {getSubcategories?.map?.((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <NumberTextField
              fullWidth
              label="Annual Turn Over"
              placeholder="Enter Annual Turn Over"
              {...getTextFieldProps(formik, "annualTurnOver")}
            />
          </div>
        </div>
        <Divider />
        <div className="px-4 pb-4">
          <LoadingButton
            variant="gradient"
            type="submit"
            fullWidth
            disabled={!formik.isValid || !formik.dirty}
            size="large"
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
            className="my-5"
          >
            Verify Business Details
          </LoadingButton>

          <div className="flex items-center justify-center gap-2">
            <SecuredDataBadge />
          </div>
        </div>
      </form>
    </Paper>
  );
}
