import { TextField, InputAdornment, Icon, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

const SearchTextField = forwardRef(function SearchTextField(
  props: TextFieldProps,
  ref: any
) {
  const { slotProps, ...restProps } = props;

  return (
    <TextField
      ref={ref}
      placeholder="Search"
      size="small"
      slotProps={{
        ...slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Icon color="primary">search</Icon>
            </InputAdornment>
          ),
          ...(slotProps?.input as any)?.startAdornment,
        },
      }}
      {...restProps}
    />
  );
});

export default SearchTextField;
