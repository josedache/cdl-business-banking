import { ReactNode } from "react";
import { Dialog, DialogContent, DialogProps, Typography } from "@mui/material";
import useToggle from "hooks/use-toggle.ts";
import { Icon } from "@iconify/react/dist/iconify.js";

function UssdPreviewDialog(props: UssdPreviewDialogProps) {
  const { children, onClose, ...restProps } = props;

  const [isOpen, toggleOpen, setOpen] = useToggle();

  function handleClose(e?: any, reason?: any) {
    onClose?.(e, reason);
    setOpen(false);
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "350px",
            },
          },
        }}
        fullWidth
        {...restProps}
      >
        <DialogContent className="py-8 px-1 ">
          <Typography className="text-center font-semibold text-neutral-600">
            USSD Code
          </Typography>

          <Typography className="flex items-center flex-wrap text-center justify-center gap-2 font-medium text-neutral-400 mt-4">
            <Icon
              icon="hugeicons:pin-code"
              width="20"
              height="20"
              className="text-neutral-700"
            />
            Dial{" "}
            <span className="text-primary-main font-semibold">*5120*11#</span>on
            your number to get your OTP
          </Typography>
        </DialogContent>
      </Dialog>

      {typeof children === "function"
        ? children({ isOpen, toggleOpen, setOpen })
        : children}
    </>
  );
}

export default UssdPreviewDialog;

export type UssdPreviewDialogProps = {
  open?: boolean;
  children?:
    | ReactNode
    | ((props: {
        isOpen: boolean;
        toggleOpen: () => void;
        setOpen: (p: any) => void;
      }) => any);
} & Omit<DialogProps, "children" | "open" | "id">;
