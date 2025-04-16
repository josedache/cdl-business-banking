import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import { TransferContentProps } from "../types/TransferStepForm";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import clsx from "clsx";
import { getTextFieldProps } from "utils/formik/get-text-field-props";
import NumberTextField from "components/NumberTextField";
import { enquiryApi } from "apis/enquiry";
import { lookupApi } from "apis/lookup";
import { useFormik } from "formik";

type TransferAddEditBeneficiaryDialogProps = {
  phone: string;
  onClose: () => void;
} & TransferContentProps &
  Omit<DialogProps, "children">;

export default function TransferAddEditBeneficiaryDialog(
  props: TransferAddEditBeneficiaryDialogProps
) {
  const { onClose, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      amount: "",
      accountNumber: "",
      bankSortCode: "",
      accountName: "",
      nameEnquiryReference: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        console.log("values", values);
        onClose();
      } catch (error) {
        enqueueSnackbar(
          error?.data?.error || "Error adding beneficiary, please try again",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const getALlBanksQuery = lookupApi.useBankLookupQuery({
    params: {
      activeOnly: true,
    },
  });
  const options =
    getALlBanksQuery?.data?.data?.map((option) => {
      const firstLetter = option.name[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    }) || [];

  const [getBankNameEnquiryMutation, getBankNameEnquiryMutationResult] =
    enquiryApi.useNameEnquiryMutation();

  const handleBankNameEnquiry = async () => {
    try {
      const resp = await getBankNameEnquiryMutation({
        body: {
          bankCode: formik.values.bankSortCode,
          accountNumber: formik.values.accountNumber,
        },
      }).unwrap();
      formik.setValues({
        ...formik.values,
        accountName: resp.data?.responseContent?.accountName,
        nameEnquiryReference: resp?.data?.responseContent?.referenceNumber,
      });

      formik.validateField("accountName");
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    formik.setFieldValue("accountName", "");
    if (
      formik.values.accountNumber.length === 10 &&
      formik.values.bankSortCode
    ) {
      handleBankNameEnquiry();
    }
  }, [formik.values.accountNumber, formik.values.bankSortCode]);

  return (
    <Dialog {...rest} className="px-0">
      <DialogTitleXCloseButton onClose={onClose} />
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <NumberTextField
              label="Amount"
              placeholder="10,000"
              autoComplete="off"
              {...getTextFieldProps(formik, "amount")}
            />

            <NumberTextField
              label="Account Number"
              placeholder="Enter account number"
              autoComplete="off"
              freeSolo
              {...getTextFieldProps(formik, "accountNumber")}
              slotProps={{
                input: {
                  inputProps: {
                    maxLength: 10,
                  },
                },
              }}
            />

            <Autocomplete
              options={options?.sort(
                (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
              )}
              fullWidth
              loading={getALlBanksQuery.isLoading}
              groupBy={(option) => option.firstLetter}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ "& > img": { mr: 2, mt: 1, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    <img
                      loading="lazy"
                      className="rounded-full w-6 h-6 bg-black"
                      src={option.icon || bankDefaultIcon}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = bankDefaultIcon;
                      }}
                      alt={option.name}
                    />
                    {option.name}
                  </Box>
                );
              }}
              value={
                options.find(
                  (option) =>
                    option.bank_sort_code === formik.values.bankSortCode
                ) || null
              }
              onChange={(_, value) => {
                formik.setFieldValue("bankSortCode", value?.bank_sort_code);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Bank" />
              )}
            />

            <div
              className={clsx(
                !formik.values.accountName ? "bg-neutral-100" : "bg-[#DBF4E9]",
                getBankNameEnquiryMutationResult?.data?.data?.responseCode ===
                  "99"
                  ? "hidden"
                  : "",
                "flex items-center gap-2 py-[6px] rounded-md px-3 w-full uppercase"
              )}
            >
              <Icon
                icon={clsx(
                  formik.values.accountName
                    ? "lets-icons:check-fill"
                    : "meteocons:not-available"
                )}
                width="20"
                height="20"
                className={clsx(
                  formik.values.accountName
                    ? "text-[#0B8A4D]"
                    : "text-neutral-400"
                )}
              />
              <Typography
                className={clsx(
                  formik.values.accountName
                    ? "text-[#0B8A4D]"
                    : "text-neutral-400"
                )}
              >
                {formik.values.accountName || "Account name"}
              </Typography>
              <div className="flex-1" />
              {getBankNameEnquiryMutationResult?.isLoading && (
                <CircularProgress
                  size={10}
                  color={formik.values.accountName ? "success" : "secondary"}
                />
              )}
            </div>

            {getBankNameEnquiryMutationResult?.data?.data?.responseCode ===
              "99" && (
              <div className="flex items-center gap-2 py-[6px] rounded-md px-3 w-full uppercase bg-[#FFFBF5]">
                <Icon
                  icon="octicon:alert-16"
                  width="20"
                  height="20"
                  className="text-[#F79009]"
                />
                <Typography className="text-neutral-400">
                  {getBankNameEnquiryMutationResult?.data?.data?.message}
                </Typography>
                <div className="flex-1" />
                {getBankNameEnquiryMutationResult?.isLoading && (
                  <CircularProgress
                    size={10}
                    color={formik.values.accountName ? "success" : "secondary"}
                  />
                )}
              </div>
            )}
          </div>

          <Divider className="mt-12" />
          <div className="px-4 py-4 flex">
            <LoadingButton
              variant="gradient"
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              size="large"
              loading={formik.isSubmitting}
              loadingPosition="end"
              fullWidth
              endIcon={<></>}
            >
              Verify Otp
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const bankDefaultIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12.512 2.634a1.74 1.74 0 0 0-1.023 0l-2.986.918A16.5 16.5 0 0 0 4.178 5.61c-.848.567-.446 1.89.574 1.89h14.496c1.02 0 1.422-1.323.575-1.89a16.5 16.5 0 0 0-4.326-2.058zM4.25 21a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75m2-4a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-1.5 0zm5.75.75a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-.75.75m4.25-.75a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-1.5 0z' stroke-width='0.5' stroke='%23fff'/%3E%3C/svg%3E";
