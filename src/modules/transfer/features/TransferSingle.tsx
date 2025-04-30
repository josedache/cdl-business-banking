import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Autocomplete,
  Avatar,
  Box,
  ButtonBase,
  CardActionArea,
  CircularProgress,
  ClickAwayListener,
  Divider,
  FormControlLabel,
  Grow,
  MenuList,
  Paper,
  Popper,
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
import { lookupApi } from "apis/lookup";
import { beneficiaryApi } from "apis/beneficiary";
import { enquiryApi } from "apis/enquiry";
import { getCheckFieldProps } from "utils/formik/get-check-field-props";
import useAuthUser from "hooks/use-auth-user";
import useDataRef from "hooks/use-data-ref";
import { transactionApi } from "apis/transaction";
import { walletApi } from "apis/wallet";
import { BANK_DEFAULT_ICON } from "constants/global";
import usePopover from "hooks/use-popover";
import { merchantApi } from "apis/merchant";
import { KYB_TIER } from "../enums/KybTierEnum";

type TransferSingleProps = {} & TransferContentProps;

export default function TransferSingle(props: TransferSingleProps) {
  const { formik } = props;

  const spanRef = useRef(null);
  const [width, setWidth] = useState(135);
  const authUser = useAuthUser();

  const actionPopover = usePopover();

  const getTransactionLimitQuery = transactionApi.useGetTransactionLimitQuery(
    {}
  );
  const getBusinessInfoQuery = merchantApi.useGetMerchantBusinessProfileQuery({
    params: {
      rc: authUser?.info?.businesses?.[0]?.rcNumber,
    },
  });
  const businessInfo = getBusinessInfoQuery?.data?.data;
  const kybTier = businessInfo?.business.kybTier;
  const registrationType = businessInfo?.business?.registrationType;

  const needsDirectors =
    kybTier === KYB_TIER.TIER_1 &&
    registrationType?.toLocaleLowerCase() !== "business name";

  const maximumAmount = Number(
    getTransactionLimitQuery?.data?.data?.single_transaction_limit || 0
  );
  const exceedsMaximumAmount = getTransactionLimitQuery?.isLoading
    ? null
    : Number(formik.values.amount) > maximumAmount;

  const getALlBanksQuery = lookupApi.useBankLookupQuery({
    params: {
      activeOnly: true,
    },
  });

  const getAllWalletsQuery = walletApi.useGetWalletsQuery({});

  const selectedWallet = getAllWalletsQuery?.data?.data?.find(
    (item) => String(item.id) === formik.values.walletId
  );

  const getAllBeneficiariesQuery = beneficiaryApi.useGetBeneficiariesQuery({
    params: {
      type: "transfer",
      userId: String(authUser?.info?.id),
      page: String(1),
      limit: String(20),
    },
  });

  const [getBankNameEnquiryMutation, getBankNameEnquiryMutationResult] =
    enquiryApi.useNameEnquiryMutation();

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

  const options =
    getALlBanksQuery?.data?.data?.map((option) => {
      const firstLetter = option.name[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    }) || [];

  const allBeneficiaries =
    getAllBeneficiariesQuery?.data?.data?.beneficiaries || [];
  const hasBeneficiaries = allBeneficiaries?.length > 0;

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

  const dataRef = useDataRef({ formik, handleBankNameEnquiry });

  useEffect(() => {
    dataRef.current.formik.setFieldValue("accountName", "");
    if (
      formik.values.accountNumber.length === 10 &&
      formik.values.bankSortCode
    ) {
      dataRef.current.handleBankNameEnquiry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.accountNumber, formik.values.bankSortCode]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 max-h-[calc(100vh-600px)] min-h-[490px] overflow-auto scrollbar-hidden">
          <div className="pt-4">
            <Typography className="text-center text-neutral-500">
              Enter amount
            </Typography>

            <HtmlTooltip
              open={exceedsMaximumAmount && needsDirectors}
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
                    to send amounts up to{" "}
                    {currencyjs(formik.values.amount).format({
                      symbol: "₦",
                    })}
                  </Typography>
                </div>
              }
            >
              <div className="w-fit flex justify-center items-center mt-2  mx-auto">
                <CurrencyTextField
                  disabled={getTransactionLimitQuery?.isLoading}
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
                  placeholder="0.00"
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
              Amount needs to be within{" "}
              {currencyjs(maximumAmount).format({
                symbol: "₦",
              })}
            </Typography>
          </div>

          <div className="flex justify-center mt-4">
            <div>
              <CardActionArea
                disabled={getAllWalletsQuery?.isLoading}
                className={clsx(
                  getAllWalletsQuery?.isLoading ||
                    getBusinessInfoQuery?.isLoading
                    ? "opacity-[0.4]"
                    : "",
                  "bg-neutral-100 py-2 px-3 flex gap-1 items-center rounded-full w-fit"
                )}
                onClick={
                  actionPopover.isOpen ? () => {} : actionPopover.togglePopover
                }
              >
                <Typography className="text-neutral-500 font-normal">
                  Transfer from
                </Typography>
                <Typography className="text-neutral-800 font-medium">
                  {formik?.values?.walletId ? (
                    <>
                      {selectedWallet?.groupId
                        ? `Main wallet Balance ${currencyjs(
                            selectedWallet?.accountBalance || ""
                          ).format({
                            symbol: "₦",
                          })}`
                        : `${selectedWallet?.name}  ${currencyjs(
                            selectedWallet?.accountBalance || ""
                          ).format({
                            symbol: "₦",
                          })}`}
                    </>
                  ) : (
                    <>Select wallet</>
                  )}
                </Typography>

                <Icon
                  icon="line-md:chevron-down"
                  width="17"
                  height="17"
                  color="#686A71"
                />

                {getAllWalletsQuery?.isLoading ? (
                  <CircularProgress size={10} />
                ) : null}

                <Popper
                  sx={{ zIndex: 1 }}
                  open={actionPopover.isOpen}
                  anchorEl={actionPopover.anchorEl}
                  role={undefined}
                  transition
                  disablePortal
                  className="w-full"
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper className="rounded-lg mt-2 w-full">
                        <ClickAwayListener
                          onClickAway={actionPopover.togglePopover}
                        >
                          <MenuList autoFocusItem>
                            {getAllWalletsQuery?.data?.data?.map((option) => {
                              const selected =
                                String(option.id) === formik.values.walletId;

                              return (
                                <ButtonBase
                                  key={option.id}
                                  className={clsx(
                                    selected
                                      ? "text-primary-main"
                                      : "text-neutral-600",
                                    "py-2 px-4 w-full flex justify-between items-center"
                                  )}
                                  onClick={() => {
                                    formik.setFieldValue(
                                      "walletId",
                                      String(option.id)
                                    );
                                    actionPopover.togglePopover();
                                  }}
                                >
                                  <Typography
                                    className={
                                      selected
                                        ? "text-primary-main"
                                        : "text-neutral-600"
                                    }
                                    variant="body2"
                                  >
                                    {option?.groupId
                                      ? "Main wallet"
                                      : option.name}
                                  </Typography>{" "}
                                  <Typography
                                    className={
                                      selected
                                        ? "text-primary-main"
                                        : "text-neutral-600"
                                    }
                                  >
                                    {currencyjs(
                                      option.accountBalance || ""
                                    ).format({
                                      symbol: "₦",
                                    })}
                                  </Typography>
                                </ButtonBase>
                              );
                            })}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </CardActionArea>
            </div>
          </div>

          {hasBeneficiaries ? (
            <div className="rounded-2xl border border-neutral-100 mt-4 p-4">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <Typography
                  variant="body2"
                  className="font-medium text-[#828384]"
                >
                  Saved beneficiaries
                </Typography>

                <div>
                  {/* <IconButton className="p-0">
                    <Icon
                      icon="hugeicons:search-01"
                      width="18"
                      height="18"
                      className="text-neutral-900"
                    />
                  </IconButton> */}
                </div>
              </div>

              <div className="flex gap-4 overflow-auto scrollbar-hidden mt-2">
                {allBeneficiaries.map((beneficiary) => (
                  <CardActionArea
                    key={beneficiary.id}
                    className="w-[80px] py-1 px-3 flex flex-col gap-[5px] items-center rounded-lg"
                    onClick={() => {
                      formik.setValues({
                        ...formik.values,
                        accountNumber: beneficiary.account_number,
                        accountName: beneficiary.account_name,
                        bankSortCode: beneficiary.bank_code,
                        nameEnquiryReference: beneficiary.nameEnquiryReference,
                      });
                    }}
                  >
                    <Avatar className="bg-[#F0F0F0] w-10 h-10 text-neutral-900 font-medium">
                      {beneficiary.account_name?.split(" ").map((name) => {
                        return name.charAt(0).toUpperCase();
                      })}
                    </Avatar>

                    <div>
                      {beneficiary.account_name
                        ?.split(" ")
                        .splice(0, 2)
                        .map((name) => (
                          <Typography
                            variant="body2"
                            className="text-neutral-700 text-center font-medium capitalize"
                            noWrap
                          >
                            {name?.toLocaleLowerCase()}
                          </Typography>
                        ))}
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
                        className={clsx(
                          "rounded-full w-6 h-6",
                          option?.icon !== "null"
                            ? "bg-transparent"
                            : "bg-neutral-500"
                        )}
                        src={option.icon || BANK_DEFAULT_ICON}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = BANK_DEFAULT_ICON;
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
                  !formik.values.accountName
                    ? "bg-neutral-100"
                    : "bg-[#DBF4E9]",
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
                      color={
                        formik.values.accountName ? "success" : "secondary"
                      }
                    />
                  )}
                </div>
              )}

              <div>
                <FormControlLabel
                  value="bottom"
                  control={<ToggleSwitch color="primary" />}
                  label="Save beneficiary for Future actions?"
                  className="flex justify-between m-0"
                  labelPlacement="start"
                  {...getCheckFieldProps(formik, "shouldAddBeneficiary")}
                />
              </div>

              <TextField
                label="Reason for payment"
                autoComplete="off"
                {...getTextFieldProps(formik, "narration")}
                placeholder="Enter reason for payment"
              />
            </div>
          </div>
        </div>
        <Divider className="mt-6" />
        <div className="px-6 py-5">
          <LoadingButton
            variant="gradient"
            loading={formik.isSubmitting}
            disabled={!formik.isValid || !formik.dirty || exceedsMaximumAmount}
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
