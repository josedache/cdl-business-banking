import type {} from "@mui/lab/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import {
  createTheme,
  responsiveFontSizes,
  alpha,
  PaletteOptions,
} from "@mui/material/styles";
import SlideUpTransition from "components/SlideUpTransition";
import DateFormat from "enums/date-format.ts";
import { toggleButtonGroupClasses } from "@mui/material";
import DatePickerTextField from "components/DatePickerTextField";

const commonPaletteOptions: PaletteOptions = {
  primary: {
    // "50": "#E7EEFF",
    // "100": "#D0DDFF",
    // "200": "#B0C6FF",
    // "300": "#89A9FE",
    // "400": "#628DFE",
    "500": "#FF6731",
    // "600": "#1046D4",
    // "700": "#0D38A9",
    // "800": "#0A2A7F",
    // "900": "#061C55",
    darker: "#042A2B",
    contrastText: "#FFFFFF",
  },
  // secondary: {

  // },
  neutral: {
    "50": "#F9FAFB",
    "100": "#F3F4F6",
    "200": "#E5E7EB",
    "300": "#D1D5DB",
    "400": "#9CA3AF",
    "500": "#686A71",
    "600": "#4B5563",
    "700": "#374151",
    "800": "#1F2937",
    "900": "#111827",
  },
  success: {
    "50": "#F0FDF4",
    "100": "#DCFCE7",
    "200": "#BBF7D0",
    "300": "#86EFAC",
    "400": "#4ADE80",
    "500": "#22C55E",
    "600": "#16A34A",
    "700": "#15803D",
    "800": "#166534",
    "900": "#14532D",
  },
  warning: {
    "50": "#FFFBEB",
    "100": "#FEF3C7",
    "200": "#FDE68A",
    "300": "#FCD34D",
    "400": "#FBBF24",
    "500": "#F59E0B",
    "600": "#D97706",
    "700": "#B45309",
    "800": "#92400E",
    "900": "#78350F",
  },
  error: {
    "50": "#FEF2F2",
    "100": "#FEE2E2",
    "200": "#FECACA",
    "300": "#FCA5A5",
    "400": "#F87171",
    "500": "#EF4444",
    "600": "#DC2626",
    "700": "#B91C1C",
    "800": "#991B1B",
    "900": "#7F1D1D",
  },
};

export const theme = responsiveFontSizes(
  createTheme({
    cssVariables: true,
    colorSchemes: {
      dark: false,
      light: {
        palette: {
          ...commonPaletteOptions,
          background: {
            default: "#F9FAFB",
          },
        },
      },
    },
    shadows: [
      "none",
      "0px 4px 40px 0px rgba(107, 114, 128, 0.15)",
      "0px 2px 5px 0px rgba(145, 158, 171, 0.12),0px 2px 2px 0px rgba(145, 158, 171, 0.12),0px 3px 1px -2px rgba(145, 158, 171, 0.12)",
      "0px 2px 9px 0px rgba(145, 158, 171, 0.12),0px 1px 3px 0px rgba(145, 158, 171, 0.12),0px 3px 3px -2px rgba(145, 158, 171, 0.12)",
      "0px 4px 4px -1px rgba(145, 158, 171, 0.12),0px 0px 5px 0px rgba(145, 158, 171, 0.12),0px 1px 10px 0px rgba(145, 158, 171, 0.12)",
      "0px 6px 6px -1px rgba(145, 158, 171, 0.12),0px -1px 10px 0px rgba(145, 158, 171, 0.12),0px 1px 14px 0px rgba(145, 158, 171, 0.12)",
      "0px 6px 6px -1px rgba(145, 158, 171, 0.2),0px -2px 12px 0px rgba(145, 158, 171, 0.2),0px 1px 18px 0px rgba(145, 158, 171, 0.2)",
    ] as any,
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
      },
    },
    typography: {
      fontFamily: [
        "Inter",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
        "-apple-system",
        "BlinkMacSystemFont",
      ].join(),
      // htmlFontSize: 10,
      fontSize: 12,
      // color: "#000051",
      button: {
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.785rem",
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: "xl",
        },
      },
      MuiIcon: {
        defaultProps: {
          baseClassName: "material-symbols-outlined",
        },
      },
      MuiDatePicker: {
        defaultProps: {
          slots: { textField: DatePickerTextField },
        },
      },
      MuiDesktopDatePicker: {
        defaultProps: {
          format: DateFormat.FORMAT,
          slots: { textField: DatePickerTextField },
        },
      },
      MuiMobileDatePicker: {
        defaultProps: {
          format: DateFormat.FORMAT,
          slots: { textField: DatePickerTextField },
        },
      },
      MuiToggleButtonGroup: {
        defaultProps: {
          variant: "pill",
          color: "neutral",
        },
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: "pill" },
                style: ({ theme }) => {
                  return {
                    [`& .${toggleButtonGroupClasses.grouped}`]: {
                      margin: theme.spacing(0.8),
                      border: 0,
                      borderRadius: theme.shape.borderRadius,
                      [`&.${toggleButtonGroupClasses.selected}`]: {
                        boxShadow: `0px 2px 4px rgba(0,0,0,0.1)`,
                      },
                      [`&.${toggleButtonGroupClasses.disabled}`]: {
                        border: 0,
                      },
                    },
                    [`& .${toggleButtonGroupClasses.middleButton}, & .${toggleButtonGroupClasses.lastButton}`]:
                      {
                        marginLeft: -1,
                        borderLeft: "1px solid transparent",
                      },
                  };
                },
              },
              {
                props: { variant: "pill", color: "neutral" },
                style: ({ theme }) => {
                  return {
                    backgroundColor: (theme.vars || theme).palette.neutral[
                      "100"
                    ],
                    [`& .${toggleButtonGroupClasses.grouped}`]: {
                      [`&.${toggleButtonGroupClasses.selected}`]: {
                        backgroundColor: (theme.vars || theme).palette
                          .background.paper,
                        color: (theme.vars || theme).palette.neutral[700],
                      },
                    },
                  };
                },
              },
              {
                props: { variant: "pill", color: "primary" },
                style: ({ theme }) => {
                  return {
                    backgroundColor: (theme.vars || theme).palette.primary[
                      "50"
                    ],
                    [`& .${toggleButtonGroupClasses.grouped}`]: {
                      [`&.${toggleButtonGroupClasses.selected}`]: {
                        backgroundColor: (theme.vars || theme).palette.primary
                          .dark,
                        color: (theme.vars || theme).palette.primary
                          .contrastText,
                      },
                    },
                  };
                },
              },
            ],
          },
        },
      },
      MuiTabs: {
        defaultProps: {
          variant: "scrollable",
        },
      },
      MuiLoadingButton: {
        defaultProps: {
          variant: "contained",
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          variant: "contained",
          shape: "default",
        },
        variants: [
          {
            props: { shape: "default" },
            style: () => ({}),
          },
          {
            props: { shape: "square" },
            style: () => ({ borderRadius: 0 }),
          },
          {
            props: { shape: "circular" },
            style: () => ({ borderRadius: 24 }),
          },
          {
            props: { size: "large" },
            style: () => ({ padding: "14px 22px" }),
          },
          {
            props: { size: "medium" },
            style: () => ({ padding: "10px 16px" }),
          },
          {
            props: { size: "small" },
            style: () => ({ padding: "6px 10px" }),
          },
        ],
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              ...(ownerState.variant === "contained"
                ? {
                    backgroundImage: "linear-gradient(111.6deg, #FF6630 46.77%, #F89130 76.64%, #EFC531 119.62%)",
                    backgroundColor: "transparent",
                    color: "#fff", 
                    "&.Mui-disabled": {
                      backgroundColor: alpha(
                        theme.palette[ownerState.color]?.main,
                        0.4
                      ),
                      color: alpha(
                        theme.palette[ownerState.color]?.contrastText,
                        0.9
                      ),
                    },
                  }
                : {}),
              ...(!isNaN(Number(ownerState.shape))
                ? { borderRadius: Number(ownerState.shape) }
                : {}),
              ...(ownerState.variant === "soft" &&
              ownerState.color === "primary"
                ? {
                    color: theme.palette[ownerState.color]?.main,
                    backgroundColor: "#F2F6EE",
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette[ownerState.color]?.main ||
                          theme.palette.grey[500],
                        0.3
                      ),
                    },
                  }
                : {}),
              ...(ownerState.variant === "soft"
                ? {
                    color:
                      theme.palette[ownerState.color]?.main ||
                      theme.palette.grey[500],
                    backgroundColor: alpha(
                      theme.palette[ownerState.color]?.main ||
                        theme.palette.grey[500],
                      0.1
                    ),
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette[ownerState.color]?.main ||
                          theme.palette.grey[500],
                        0.3
                      ),
                    },
                  }
                : {}),
            };
          },
        },
      },
      MuiChip: {
        defaultProps: { variant: "soft" },
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              ...(ownerState.variant === "soft"
                ? {
                    color:
                      theme.palette[ownerState.color]?.main ||
                      theme.palette.grey[500],
                    backgroundColor: alpha(
                      theme.palette[ownerState.color]?.main ||
                        theme.palette.grey[500],
                      0.2
                    ),
                    padding: "1px px",
                    height: 24,
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette[ownerState.color]?.main ||
                          theme.palette.grey[500],
                        0.3
                      ),
                    },
                  }
                : {}),
            };
          },
        },
      },
      MuiIconButton: {
        defaultProps: {},
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              ...(!isNaN(Number(ownerState.shape))
                ? { borderRadius: Number(ownerState.shape) }
                : {
                    borderRadius: { square: 0, default: 8 }[ownerState.shape],
                  }),
              ...(ownerState.variant === "contained"
                ? {
                    color:
                      theme.palette[ownerState.color]?.contrastText ||
                      theme.palette.text.primary,
                    backgroundColor:
                      theme.palette[ownerState.color]?.main ||
                      theme.palette.grey[500],
                    "&:hover": {
                      backgroundColor:
                        theme.palette[ownerState.color]?.dark ||
                        theme.palette.grey[700],
                    },
                  }
                : {}),
              ...(ownerState.variant === "soft"
                ? {
                    color:
                      theme.palette[ownerState.color]?.main ||
                      theme.palette.grey[500],
                    backgroundColor: alpha(
                      theme.palette[ownerState.color]?.main ||
                        theme.palette.grey[500],
                      0.2
                    ),
                    "&:hover": {
                      backgroundColor: alpha(
                        theme.palette[ownerState.color]?.main ||
                          theme.palette.grey[500],
                        0.3
                      ),
                    },
                  }
                : {}),
              ...(ownerState.variant === "outlined"
                ? {
                    border: `1px solid ${
                      theme.palette[ownerState.color]?.main ||
                      theme.palette.divider
                    }`,
                  }
                : {}),
            };
          },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          shrink: true,
          classes: { asterisk: "text-error-main" },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: () => ({
            "&.MuiInputBase-formControl": {},
          }),
        },
      },
      MuiFilledInput: {
        defaultProps: { disableUnderline: true },
      },
      MuiOutlinedInput: {
        defaultProps: { notched: false },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            return {
              "& .MuiFilledInput-input": {
                borderRadius: 16,
              },

              "& .MuiFormLabel-root": {
                color: theme.palette.text.primary,
                fontWeight: theme.typography.fontWeightMedium,
              },

              "&:focus-within": {
                "& .MuiFormLabel-root": {
                  color: theme.palette.text.primary,
                },
              },

              "&:focus": {
                border: "none",
              },

              "& .MuiInputBase-input": {
                fontSize: "0.8rem",

                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 100px transparent inset`,
                  WebkitTextFillColor: "#000000",
                },
              },

              ...(ownerState.variant === "outlined"
                ? {
                    paddingTop: ownerState.label
                      ? ownerState.size === "small"
                        ? 14
                        : 20
                      : undefined,

                    "& .MuiInputLabel-shrink": {
                      transform:
                        ownerState.size === "small"
                          ? "translate(0px, 0px) scale(0.60)"
                          : "translate(0px, 0px) scale(0.80)",
                    },

                    "& .MuiInputBase-root": {
                      backgroundColor: "#FFFFFF",
                      borderRadius: 8,

                      "& > fieldset": {
                        border: "1px solid #D1D5DB",
                      },
                    },
                  }
                : {}),

              ...(ownerState.variant === "filled"
                ? {
                    "& .MuiInputBase-root": {
                      borderRadius: 8,
                      paddingTop: ownerState.size === "small" ? 1 : 2,
                      paddingBottom: ownerState.size === "small" ? 1 : 2,
                    },
                  }
                : {}),
            };
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            "&.MuiStepIcon-root.Mui-completed": {
              color: "#16A349",
            },
          },
        },
      },

      MuiStep: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },

      MuiStepLabel: {
        styleOverrides: {
          iconContainer: {
            padding: 0,
          },
        },
      },

      MuiPaper: {
        defaultProps: {
          shape: "circular",
        },
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            return {
              borderRadius: { square: 0, default: 8 }[ownerState.shape],
              border: `1px solid ${theme.palette.divider}`,
            };
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          TransitionComponent: SlideUpTransition,
        },
      },
    },
  })
);

export default theme;

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }

  interface PaletteColor {
    lighter?: string;
    lighterAlt?: string;
    darker?: string;
    darkerAlt?: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    lighterAlt?: string;
    darker?: string;
    darkerAlt?: string;
  }
}

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    "2xl": true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }

  interface ButtonOwnProps {
    shape?: "square" | "default" | "circular" | number;
  }

  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    variant?: "contained" | "outlined" | "soft" | "default";
    shape?: "square" | "default" | number;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperOwnProps {
    shape?: "square" | "default" | "circular" | number;
  }
}

declare module "@mui/material/ToggleButtonGroup" {
  interface ToggleButtonGroupPropsColorOverrides {
    neutral: true;
  }

  interface ToggleButtonGroupProps {
    variant?: "standard" | "pill";
  }
}
