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
import { Icon as Iconify } from "@iconify/react";
import clsx from "clsx";

import usePopover from "hooks/use-popover";
import useSideNavigation from "hooks/use-side-navigation";
import Logo from "components/Logo";
import useSidebarIcon from "hooks/use-sidebar-icon";

function AppProtectedHeader(props: AppBarProps) {
  const { ...restProps } = props;

  const infoPopover = usePopover();

  const sideNavigation = useSideNavigation();
  const sidebarIcon = useSidebarIcon();

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
                size="small"
                slotProps={{
                  input: {
                    autoComplete: "off",
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
              <Avatar
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M14 7a6.98 6.98 0 0 1-1.941 4.838A6.98 6.98 0 0 1 7.02 14h-.04a6.98 6.98 0 0 1-5.039-2.162A7 7 0 1 1 14 7m-2.757 3.5A5.49 5.49 0 0 0 7 8.5a5.49 5.49 0 0 0-4.243 2A5.49 5.49 0 0 0 7 12.5a5.49 5.49 0 0 0 4.243-2M7 7.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5' clip-rule='evenodd'/%3E%3C/svg%3E"
                className="w-full h-full text-primary-500"
              />
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
