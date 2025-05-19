import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import COUNTRIES from "../constants/settings-countries";
import { getTextFieldProps } from "utils/formik/get-text-field-props";

type SettingsEditDirectorsFormProps = {
  formik: any;
  selectedCode: string;
  setSelectedCode: React.Dispatch<React.SetStateAction<string>>;
  isPoliticallyExposed: boolean;
  setIsPoliticallyExposed: React.Dispatch<React.SetStateAction<boolean>>;
  ownsMoreThanFivePercent: boolean;
  setOwnsMoreThanFivePercent: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingsEditDirectorsForm = (props: SettingsEditDirectorsFormProps) => {
  const {
    formik,
    selectedCode,
    setSelectedCode,
    isPoliticallyExposed,
    setIsPoliticallyExposed,
    ownsMoreThanFivePercent,
    setOwnsMoreThanFivePercent,
  } = props;

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

  return (
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
      <div className="flex items-start sm:items-center gap-2 sm:gap-4 bg-sky-50 px-3 py-2 mt-4">
        <Iconify
          fontSize={22}
          icon="ph:info-fill"
          className="text-sky-500 p-0 "
        />
        <Typography className="text-neutral-600 text-shadow-lg">
          Why do we need your director’s BVN?{" "}
          <span className="text-neutral-800 font-semibold sm:ml-2.5 cursor-pointer">
            <Tooltip
              placement="bottom"
              className="cursor-pointer"
              title={
                <div className="p-2 ">
                  <Typography variant="body2" className="">
                    We use your director’s BVN to verify their identity. It
                    helps ensure your business account is secure and compliant
                    with financial regulations.
                  </Typography>
                </div>
              }
              enterDelay={100}
              leaveDelay={500}
            >
              <span>See why</span>
            </Tooltip>
          </span>
        </Typography>
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
                      <Typography className="text-neutral-800 text-base">
                        {selectedCode}
                      </Typography>
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
        <span className="text-red-500 text-xs ml-3">
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
              <InputAdornment position="end" className="cursor-pointer">
                <Tooltip
                  placement="top"
                  title={
                    <div className="p-2 ">
                      <Typography variant="body2">KYC purpose</Typography>
                    </div>
                  }
                  enterDelay={100}
                  leaveDelay={500}
                >
                  <IconButton>
                    <Iconify
                      fontSize={16}
                      icon="material-symbols:help-outline-rounded"
                      className="text-neutral-500 p-0"
                    />
                  </IconButton>
                </Tooltip>
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
          className={clsx(
            isPoliticallyExposed
              ? "border-[1.5px] border-neutral-800 font-semibold"
              : "border-[1.5px] border-neutral-200",
            "bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold "
          )}
        >
          Yes
        </Button>
        <Button
          type="button"
          onClick={() => {
            handleTogglePoliticallyExposed(false);
          }}
          className={clsx(
            !isPoliticallyExposed
              ? "border-[1.5px] border-neutral-800 font-semibold"
              : "border-[1.5px] border-neutral-200",
            "bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold "
          )}
        >
          No
        </Button>
      </div>
      <Typography className="mt-6 font-medium text-neutral-600">
        Does this director own 5% or more shares in the company. If yes, they
        would be added as a shareholder
      </Typography>{" "}
      <div className="flex gap-6 mt-6">
        <Button
          type="button"
          onClick={() => {
            handleToggleOwnsMoreThanFivePercent(true);
          }}
          className={clsx(
            ownsMoreThanFivePercent
              ? "border-[1.5px] border-neutral-800 font-semibold"
              : "border-[1.5px] border-neutral-200",
            "bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold "
          )}
        >
          Yes
        </Button>
        <Button
          type="button"
          onClick={() => {
            handleToggleOwnsMoreThanFivePercent(false);
          }}
          className={clsx(
            !ownsMoreThanFivePercent
              ? "border-[1.5px] border-neutral-800 font-semibold"
              : "border-[1.5px] border-neutral-200",
            "bg-neutral-200 px-8 py-1.5 font-medium hover:border-[1.5px]  hover:border-neutral-800 text-neutral-800 hover:font-semibold "
          )}
        >
          No
        </Button>
      </div>
      <TextField
        fullWidth
        className="mt-6"
        label="Share holder Percentage"
        placeholder="8"
        {...getTextFieldProps(formik, "sharePercentage")}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          },
        }}
      />
    </div>
  );
};

export default SettingsEditDirectorsForm;
