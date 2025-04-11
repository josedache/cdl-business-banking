import { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Autocomplete,
  Avatar,
  Box,
  CardActionArea,
  Divider,
  FormControlLabel,
  IconButton,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import currencyjs from "currency.js";
import clsx from "clsx";
import { LoadingButton } from "@mui/lab";

import CurrencyTextField from "components/CurrencyTextField";
import NumberTextField from "components/NumberTextField";
import ToggleSwitch from "components/ToggleSwitch";
import { TransferContentProps } from "../types/TransferStepForm";
import { getTextFieldProps } from "utils/formik/get-text-field-props";

type TransferSingleProps = {} & TransferContentProps;

export default function TransferSingle(props: TransferSingleProps) {
  const { formik } = props;

  const spanRef = useRef(null);
  const [width, setWidth] = useState(135);

  const maximumAmount = 5000000;
  const exceedsMaximumAmount = Number(formik.values.amount) >= maximumAmount;

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    formik.setFieldValue("amount", newValue);

    if (newValue.length === formik.values.amount.length) {
      return;
    }

    const spanWidth = spanRef.current.offsetWidth;
    const newWidth = Math.max(
      spanWidth + (newValue.length - formik.values.amount.length) * 10,
      100
    ); // Adjust width dynamically
    setWidth(newWidth);
  };

  const handleClearAmount = () => {
    formik.setFieldValue("amount", "");
    setWidth(135);
  };

  const options = banks.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const hasBeneficiaries = beneficiaries.length > 0;
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 max-h-[calc(100vh-500px)] min-h-[450px] overflow-auto scrollbar-hidden">
          <div className="pt-4">
            <Typography className="text-center text-neutral-500">
              Enter amount
            </Typography>

            <HtmlTooltip
              open={exceedsMaximumAmount}
              arrow
              placement="left"
              title={
                <div className="w-full flex gap-2">
                  <div>
                    <div className="w-10 h-10 rounded-xl border border-[#EFEFEF] bg-[#F9F9F9] inline-flex items-center justify-center">
                      <Icon
                        icon="hugeicons:money-add-01"
                        width="20"
                        height="20"
                        className="text-primary-main"
                      />
                    </div>
                  </div>

                  <Typography color="textPrimary">
                    <span className="underline text-primary-main">
                      Add Director’s info
                    </span>{" "}
                    to send amounts up to
                    {currencyjs(formik.values.amount).format({
                      symbol: "₦",
                    })}
                  </Typography>
                </div>
              }
            >
              <div className="w-fit flex justify-center items-center mt-2  mx-auto">
                <CurrencyTextField
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "0.5rem",
                      border: "none",
                      fontWeight: 600,
                      width: "100%",
                      maxWidth: width,
                      backgroundColor: "transparent",
                      "& > fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  autoComplete="off"
                  ref={spanRef}
                  value={formik.values.amount}
                  autoFocus
                  onChange={handleChange}
                  code="NGN"
                  placeholder="00.00"
                  className="text-neutral-300 font-semibold justify-center select-none"
                  variant="outlined"
                  inputProps={{
                    style: { fontSize: "2rem", padding: 0 },
                  }}
                />
                {formik.values.amount ? (
                  <Icon
                    icon="si:close-fill"
                    width="24"
                    height="24"
                    className="inline-block cursor-pointer text-[#141B34]"
                    onClick={handleClearAmount}
                  />
                ) : null}
              </div>
            </HtmlTooltip>

            <Typography
              variant="body2"
              className={clsx(
                exceedsMaximumAmount ? "visible" : "invisible",
                "text-center font-light text-[#D92D20] p-0 leading-3"
              )}
            >
              Amount needs to be within
              {currencyjs(maximumAmount).format({
                symbol: "₦",
              })}
            </Typography>
          </div>

          <div className="flex justify-center mt-4">
            <CardActionArea className="bg-neutral-100 py-2 px-3 flex gap-1 items-center rounded-full w-fit">
              <Typography className="text-neutral-500 font-normal">
                Transfer from
              </Typography>
              <Typography className="text-neutral-800 font-medium">
                Main wallet balance
                {currencyjs(10).format({
                  symbol: "₦",
                })}
              </Typography>
              <Icon
                icon="line-md:chevron-down"
                width="17"
                height="17"
                color="#686A71"
              />
            </CardActionArea>
          </div>

          {hasBeneficiaries ? (
            <div className="rounded-2xl border border-neutral-100 mt-4 p-4">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <Typography className="font-medium text-[#828384]">
                  Saved beneficiaries
                </Typography>

                <div>
                  <IconButton className="p-0">
                    <Icon
                      icon="hugeicons:search-01"
                      width="18"
                      height="18"
                      className="text-neutral-900"
                    />
                  </IconButton>
                </div>
              </div>

              <div className="flex gap-4 overflow-auto scrollbar-hidden mt-2">
                {beneficiaries.map((beneficiary) => (
                  <CardActionArea
                    key={beneficiary.id}
                    className="w-[80px] py-2 px-3 flex flex-col gap-[5px] items-center"
                  >
                    <Avatar className="bg-[#F0F0F0] w-10 h-10 text-neutral-900 font-medium">
                      {beneficiary.firstName.charAt(0).toUpperCase()}
                      {beneficiary.lastName.charAt(0).toUpperCase()}
                    </Avatar>

                    <div>
                      <Typography
                        className="text-neutral-700 text-center font-medium"
                        noWrap
                      >
                        {beneficiary.firstName}
                      </Typography>
                      <Typography
                        className="text-neutral-700 text-center font-medium"
                        noWrap
                      >
                        {beneficiary.lastName}
                      </Typography>
                    </div>
                  </CardActionArea>
                ))}
              </div>
            </div>
          ) : null}
          {hasBeneficiaries ? null : <Divider className="mt-4" />}

          <div>
            <Typography className="font-semibold mt-4 py-1 text-neutral-500 uppercase">
              New transaction
            </Typography>

            <div className="grid gap-4 mt-4">
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
                options={options.sort(
                  (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                )}
                fullWidth
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...optionProps}
                    >
                      <img
                        loading="lazy"
                        className="rounded-full w-6 h-6"
                        srcSet={`https://flagcdn.com/w24/ngn.png 2x`}
                        src={`https://flagcdn.com/w24/ngn.png`}
                        alt={option.title}
                      />
                      {option.title}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Bank" />
                )}
              />

              <div className="flex items-center gap-2 py-[6px] rounded-md px-3 w-full bg-[#DBF4E9]">
                <Icon
                  icon="lets-icons:check-fill"
                  width="20"
                  height="20"
                  className="text-[#095C35]"
                />
                <Typography className="text-[#095C35]">
                  SEGUN AKINNIBOSUN
                </Typography>
              </div>

              <div>
                <FormControlLabel
                  value="bottom"
                  control={<ToggleSwitch color="primary" />}
                  label="Save beneficiary for Future actions?"
                  className="flex justify-between m-0"
                  labelPlacement="start"
                />
              </div>

              <TextField
                label="Reason for payment"
                autoComplete="off"
                placeholder="Enter reason for payment"
              />
            </div>
          </div>
        </div>
        <Divider className="mt-6" />
        <div className="px-6 py-6">
          <LoadingButton
            variant="gradient"
            loading={formik.isSubmitting}
            disabled={!formik.isValid || !formik.dirty}
            type="submit"
            size="large"
            fullWidth
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    "&::before": {
      backgroundColor: theme.palette.common.white,
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    boxShadow:
      "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
    backgroundColor: theme.palette.common.white,
    maxWidth: 290,
    padding: 12,
    width: "100%",
    borderRadius: 8,
  },
}));

const banks = [
  {
    title: "Access Bank",
    icon: "logos:access-bank",
  },
  {
    title: "First Bank",
    icon: "logos:first-bank",
  },
  {
    title: "GTBank",
    icon: "logos:gtbank",
  },
  {
    title: "Zenith Bank",
    icon: "logos:zenith-bank",
  },
  {
    title: "UBA",
    icon: "logos:uba",
  },
  {
    title: "Fidelity Bank",
    icon: "logos:fidelity-bank",
  },
  {
    title: "Union Bank",
    icon: "logos:union-bank",
  },
  {
    title: "Wema Bank",
    icon: "logos:wema-bank",
  },
  {
    title: "Stanbic IBTC",
    icon: "logos:stanbic-ibtc",
  },
  {
    title: "Ecobank",
    icon: "logos:ecobank",
  },
  {
    title: "Heritage Bank",
    icon: "logos:heritage-bank",
  },
  {
    title: "Polaris Bank",
    icon: "logos:polaris-bank",
  },
  {
    title: "Keystone Bank",
    icon: "logos:keystone-bank",
  },
  {
    title: "Standard Chartered Bank",
    icon: "logos:standard-chartered-bank",
  },
  {
    title: "Citibank Nigeria",
    icon: "logos:citi-bank",
  },
  {
    title: "Union Bank UK",
    icon: "logos:union-bank-uk",
  },
  {
    title: "FSDH Merchant Bank",
    icon: "logos:fsdh-merchant-bank",
  },
  {
    title: "Sterling Bank",
    icon: "logos:sterling-bank",
  },
  {
    title: "CitiBank Nigeria",
    icon: "logos:citi-bank-nigeria",
  },
  {
    title: "Jaiz Bank",
    icon: "logos:jaiz-bank",
  },
  {
    title: "SunTrust Bank",
    icon: "logos:suntrust-bank",
  },
  {
    title: "Unity Bank",
    icon: "logos:unity-bank",
  },
  {
    title: "FBNQuest Merchant Bank",
    icon: "logos:fbnquest-merchant-bank",
  },
  {
    title: "Rand Merchant Bank",
    icon: "logos:rand-merchant-bank",
  },
  {
    title: "VFD Microfinance Bank",
    icon: "logos:vfd-microfinance-bank",
  },
];

const beneficiaries = [
  {
    id: 1,
    firstName: "Sylvernus",
    lastName: "Akubo",
    accountNumber: "1234567890",
    bankName: "First Bank",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    accountNumber: "0987654321",
    bankName: "Access Bank",
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    accountNumber: "1122334455",
    bankName: "GTBank",
  },
  {
    id: 4,
    firstName: "Bob",
    lastName: "Brown",
    accountNumber: "5566778899",
    bankName: "Zenith Bank",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Davis",
    accountNumber: "9988776655",
    bankName: "UBA",
  },
  {
    id: 6,
    firstName: "David",
    lastName: "Wilson",
    accountNumber: "4433221100",
    bankName: "Fidelity Bank",
  },
];
