import { ReactNode, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton.tsx";
import useToggle from "hooks/use-toggle.ts";
import * as dfns from "date-fns";
import { useFormik } from "formik";
import * as yup from "yup";
import { TransactionFilterPeriod } from "modules/transaction/enums/transaction-filter-period.ts";
import { getTextFieldProps } from "utils/formik/get-text-field-props.ts";
import DatePicker from "components/DatePicker.tsx";
import CurrencyTextField from "components/CurrencyTextField.tsx";
import { TransactionType } from "modules/transaction/enums/transaction-type.ts";
import { getTextFieldHelperTextAndError } from "utils/formik/get-text-field-helper-text-and-error.ts";
import { PAGE_LIMIT } from "constants/pagination.ts";

function TransactionFilter(props: TransactionFilterProps) {
  const { filter, onFilterApply, children, onClose, ...restProps } = props;

  const [isOpen, toggleOpen, setOpen] = useToggle();

  const endOfToday = useMemo(() => dfns.endOfToday(), []);

  const formik = useFormik<TransactionFilterState>({
    initialValues: {
      pageIndex: filter.pageIndex ?? 0,
      limit: filter?.limit ?? PAGE_LIMIT,
      period: filter?.period ?? "",
      startDate: filter?.startDate ?? null,
      endDate: filter?.endDate ?? null,
      minimumAmount: filter?.minimumAmount ?? 0,
      maximumAmount: filter?.maximumAmount ?? 0,
      transactionType: filter?.transactionType ?? "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      period: yup.string().label("Period").optional(),
      startDate: yup
        .date()
        .label("Start Date")
        .when("period", ([period], schema) => {
          return period == String(TransactionFilterPeriod.Custom)
            ? schema.required()
            : schema.nullable().optional();
        }),
      endDate: yup
        .date()
        .label("End Date")
        .when("period", ([period], schema) => {
          return period == String(TransactionFilterPeriod.Custom)
            ? schema.required()
            : schema.nullable().optional();
        }),
      minimumAmount: yup.number().label("Minimum Amount").optional(),
      maximumAmount: yup.number().label("Maximum Amount").optional(),
      transactionType: yup.number().label("Transaction Type").optional(),
    }),
    onSubmit: (values) => {
      const dateRange = {
        [TransactionFilterPeriod.Last7Days]: {
          startDate: dfns.subDays(endOfToday, 7),
          endDate: endOfToday,
        },
        [TransactionFilterPeriod.LastMonth]: {
          startDate: dfns.startOfMonth(dfns.subMonths(endOfToday, 1)),
          endDate: dfns.endOfMonth(dfns.subMonths(endOfToday, 1)),
        },
        [TransactionFilterPeriod.Custom]: {
          startDate: null,
          endDate: null,
        },
      }[values.period];

      onFilterApply({ ...values, ...dateRange });
      handleClose();
    },
  });

  function handleClose(e?: any, reason?: any) {
    onClose?.(e, reason);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="xs" {...restProps}>
        <DialogTitleXCloseButton onClose={handleClose}>
          Filter
        </DialogTitleXCloseButton>
        <DialogContent className="grid grid-cols-2 gap-4">
          <TextField
            className="col-span-2"
            fullWidth
            select
            label="Period"
            placeholder="Select time period"
            {...getTextFieldProps(formik, "period")}
          >
            {[
              {
                label: "Last 7 days",
                value: TransactionFilterPeriod.Last7Days,
              },
              {
                label: "Last Month",
                value: TransactionFilterPeriod.LastMonth,
              },
              {
                label: "Custom",
                value: TransactionFilterPeriod.Custom,
              },
            ].map(({ label, value }) => (
              <MenuItem key={label} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          {formik.values.period == String(TransactionFilterPeriod.Custom) ? (
            <>
              <div className="col-span-2 flex items-center gap-2">
                <DatePicker
                  className="flex-1"
                  value={formik.values.startDate}
                  onChange={(value) => {
                    if (!dfns.isValid(value)) {
                      return;
                    }
                    formik.setFieldValue("startDate", value);
                  }}
                  slotProps={{
                    textField: {
                      ...getTextFieldHelperTextAndError(formik, "startDate"),
                    },
                  }}
                />
                <Typography variant="body2">to</Typography>
                <DatePicker
                  className="flex-1"
                  value={formik.values.endDate}
                  onChange={(value) => {
                    if (!dfns.isValid(value)) {
                      return;
                    }
                    formik.setFieldValue("endDate", value);
                  }}
                  slotProps={{
                    textField: {
                      ...getTextFieldHelperTextAndError(formik, "endDate"),
                    },
                  }}
                />
              </div>
            </>
          ) : null}
          <TextField
            className="col-span-2"
            fullWidth
            select
            label="Transaction Type"
            placeholder="Select transaction type"
            {...getTextFieldProps(formik, "transactionType")}
          >
            {Object.keys(TransactionType)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <MenuItem key={key} value={TransactionType[key]}>
                  {key.toUpperCase()}
                </MenuItem>
              ))}
          </TextField>
          <div className="col-span-2">
            <FormLabel>Amount</FormLabel>
            <div className="flex items-center gap-2 mt-1">
              <CurrencyTextField
                className="flex-1"
                {...getTextFieldProps(formik, "minimumAmount")}
              />
              <Typography variant="body2">to</Typography>
              <CurrencyTextField
                className="flex-1"
                {...getTextFieldProps(formik, "maximumAmount")}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            fullWidth
            variant="gradient"
            onClick={formik.handleSubmit as any}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </Dialog>
      {typeof children === "function"
        ? children({ isOpen, toggleOpen, setOpen })
        : children}
    </>
  );
}

export default TransactionFilter;

export type TransactionFilterProps = {
  filter: TransactionFilterState;
  onFilterApply: (filter: TransactionFilterState) => void;
  open?: boolean;
  children?:
    | ReactNode
    | ((props: {
        isOpen: boolean;
        toggleOpen: () => void;
        setOpen: (p: any) => void;
      }) => any);
} & Omit<DialogProps, "children" | "open" | "id">;

export type TransactionFilterState = {
  pageIndex: number;
  limit: number;
  period: string;
  startDate: Date;
  endDate: Date;
  transactionType: string;
  minimumAmount: number;
  maximumAmount: number;
};
