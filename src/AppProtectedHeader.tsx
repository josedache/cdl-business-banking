import {
  AppBar,
  AppBarProps,
  Avatar,
  Icon,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import usePopover from "hooks/use-popover";
import useSideNavigation from "hooks/use-side-navigation";
import { Icon as Iconify } from "@iconify/react";
import clsx from "clsx";
import useAuthUser from "hooks/use-auth-user";
import Logo from "components/Logo";

function AppProtectedHeader(props: AppBarProps) {
  const { ...restProps } = props;

  const authUser = useAuthUser();

  const infoPopover = usePopover();

  const sideNavigation = useSideNavigation();

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
          "w-full lg:w-[calc(100%-270px)] lg:ml-[270px] md:bg-white bg-[#042A2B] rounded-none border-b md:border-gray-200 border-[#042A2B] py-1"
        )}
        {...restProps}
      >
        <Toolbar disableGutters>
          <div className="md:flex hidden items-center justify-center gap-2 px-8 w-full">
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
              {isBasicInformationCompleted &&
              isIdentificationCompleted &&
              isAccountDetailsCompleted
                ? "Hello"
                : "Welcome"}
              , <b>{authUser?.firstname}</b>
            </Typography>
            <div className="flex-1" />

            <div className=" border rounded-full w-10 h-10 border-neutral-100 ">
              <IconButton color="inherit" className="" disabled>
                {/* <Badge badgeContent={7} color="error"> */}
                <Iconify className="MuiIcon-root" icon="mdi:bell-outline" />
                {/* </Badge> */}
              </IconButton>
            </div>

            <Avatar src={authUser?.avatar}>
              {authUser?.firstname?.[0]}
              {authUser?.lastname?.[0]}
            </Avatar>
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

            <IconButton
              className="text-white"
              onClick={() => sideNavigation.toggle()}
            >
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
