import {
  AppBar,
  AppBarProps,
  Avatar,
  Card,
  Icon,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import usePopover from "hooks/use-popover";
import useSideNavigation from "hooks/use-side-navigation";
import { Icon as Iconify } from "@iconify/react";
import clsx from "clsx";
import useAuthUser from "hooks/use-auth-user";
import Logo from "components/Logo";
import useSidebarIcon from "hooks/use-sidebar-icon";

function AppProtectedHeader(props: AppBarProps) {
  const { ...restProps } = props;

  const authUser = useAuthUser();

  const infoPopover = usePopover();

  const sideNavigation = useSideNavigation();
  const sidebarIcon = useSidebarIcon();

  const isBasicInformationCompleted =
    authUser?.firstname &&
    authUser?.lastname &&
    authUser?.bvn &&
    authUser?.mobileNo &&
    authUser?.email;

  const isIdentificationCompleted = authUser?.nin;

  const isAccountDetailsCompleted =
    authUser?.bank_details?.accountnumber &&
    authUser?.bank_details?.accountname;

  // const islg = useMediaQuery(MediaBreakpoint.LG);

  return (
    <>
      <AppBar
        elevation={0}
        position="sticky"
        color="inherit"
        className={clsx(
          sidebarIcon.isOpen
            ? "lg:w-[calc(100%-270px)] lg:ml-[270px]"
            : "lg:w-[calc(100%-80px)]  lg:ml-[80px]",
          "w-full border-y-0 border-x-0 border-b-1 border-b-[#E0E5EB] bg-background-default rounded-none py-4"
        )}
        {...restProps}
      >
        <Toolbar disableGutters>
          <div className="md:flex hidden items-center justify-center gap-2 px-10 w-full">
            <IconButton
              className="lg:hidden"
              color="inherit"
              onClick={() => sideNavigation.toggle()}
            >
              <Icon>
                <Iconify icon="material-symbols:menu" />
              </Icon>
            </IconButton>
            <Typography>
              <TextField
                fullWidth
                slotProps={{
                  input: {
                    style: {
                      borderRadius: 100,
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          icon="hugeicons:search-01"
                          width="24"
                          height="24"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                className="rounded-full max-w-[800px]"
              />
            </Typography>
            <div className="flex-1" />

            <div className=" border-1 rounded-full w-10 h-10 border-[#EDEFF2] bg-[#FAFAFA]">
              <IconButton color="" className="" disabled>
                <Iconify
                  className="MuiIcon-root"
                  icon="hugeicons:notification-02"
                />
              </IconButton>
            </div>

            <Card
              sx={{
                background:
                  "linear-gradient(221deg, #C63E0E 27.25%, #FF7849 102.65%);Linear Gradient",
              }}
              className="p-1.5 w-[40px] h-[40px] rounded-full"
            >
              <Avatar className="w-full h-full bg-white text-primary-500">
                {authUser?.firstname?.[0]}
                {authUser?.lastname?.[0]}
              </Avatar>
            </Card>

            <Popover
              open={infoPopover.isOpen}
              anchorEl={infoPopover.anchorEl}
              onClose={infoPopover.togglePopover}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              className="p-2"
            ></Popover>
          </div>

          <div className="flex md:hidden items-center justify-between gap-2 px-8 w-full">
            <Logo variant="1" />

            <IconButton onClick={() => sideNavigation.toggle()}>
              <Icon>
                <Iconify icon="material-symbols:menu" />
              </Icon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default AppProtectedHeader;
