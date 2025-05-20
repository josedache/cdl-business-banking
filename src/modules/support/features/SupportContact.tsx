import { ReactNode } from "react";
import {
  ButtonBase,
  Dialog,
  DialogContent,
  DialogProps,
  Icon,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton.tsx";
import useToggle from "hooks/use-toggle.ts";
import { Icon as Iconify } from "@iconify/react";
import useAuthUser from "hooks/use-auth-user.ts";

function SupportContact(props: SupportContactProps) {
  const { children, onClose, ...restProps } = props;

  const authUser = useAuthUser();

  const [isOpen, toggleOpen, setOpen] = useToggle();

  function handleClose(e?: any, reason?: any) {
    onClose?.(e, reason);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="xs" {...restProps}>
        <DialogTitleXCloseButton onClose={handleClose} />
        <DialogContent>
          <div className="text-center mb-6 space-y-2">
            <Typography variant="h5">Customer Support</Typography>
            <Typography variant="body1">
              Hey{" "}
              <span className="capitalize">
                {authUser?.info?.firstName?.toLowerCase()}
              </span>
              , We’re here to help! Choose how to reach us.
            </Typography>
          </div>
          <Paper variant="outlined" className="bg-neutral-100 p-4 space-y-2">
            {[
              {
                label: "Email",
                icon: "line-md:email-filled",
                component: "a",
                href: "mailto:cdlbusiness@creditdirect.ng ",
              },
              {
                label: "Phone number",
                icon: "mingcute:phone-call-fill",
                component: "a",
                href: "tel:02014482225 ",
              },
              { label: "Live chat", icon: "fluent:chat-24-filled" },
            ].map(({ label, icon, ...props }) => (
              <ButtonBase
                key={label}
                className="flex items-center gap-4 text-left p-2 w-full"
                {...props}
              >
                <IconButton
                  disableRipple
                  variant="outlined"
                  color="primary"
                  className="bg-primary-100"
                >
                  <Icon>
                    <Iconify icon={icon} />
                  </Icon>
                </IconButton>
                <Typography className="flex-1">{label}</Typography>
                <Icon>
                  <Iconify icon="iconoir:nav-arrow-right" />
                </Icon>
              </ButtonBase>
            ))}
          </Paper>
        </DialogContent>
      </Dialog>
      {typeof children === "function"
        ? children({ isOpen, toggleOpen, setOpen })
        : children}
    </>
  );
}

export default SupportContact;

export type SupportContactProps = {
  open?: boolean;
  children?:
    | ReactNode
    | ((props: {
        isOpen: boolean;
        toggleOpen: () => void;
        setOpen: (p: any) => void;
      }) => any);
} & Omit<DialogProps, "children" | "open" | "id">;
