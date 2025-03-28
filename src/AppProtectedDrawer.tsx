import {
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  Icon,
  IconButton,
  List,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  Link as MuiLink,
  ListItemButton,
  Collapse,
  Button,
  Popover,
  Avatar,
} from "@mui/material";
import clsx from "clsx";
import Logo from "components/Logo";
import MediaBreakpoint from "enums/media-breakpoint";
import useSideNavigation from "hooks/use-side-navigation";
import { Link, matchPath, useLocation } from "react-router-dom";
import { Icon as Iconify } from "@iconify/react";
import DialogTitleXCloseButton from "components/DialogTitleXCloseButton";
import useToggle from "hooks/use-toggle";
import { useMemo } from "react";
import useAuthUser from "hooks/use-auth-user";
import usePopover from "hooks/use-popover";

function AppProtectedDrawer() {
  const islg = useMediaQuery(MediaBreakpoint.LG);

  // const { logout } = useLogout();
  const authUser = useAuthUser();

  const infoPopover = usePopover();

  const sideNavigation = useSideNavigation();

  const [isSupport, toggleSupport] = useToggle();

  const NAV_LINKS = [
    // {
    //   links: [
    //     {
    //       icon: "hugeicons:dashboard-square-02",
    //       label: "Dashboard",
    //       to: DASHBOARD,
    //       kycAllow: true,
    //     },
    //     {
    //       icon: "ph:plant",
    //       label: "Yields",
    //       links: [
    //         {
    //           label: "Fixed Yield",
    //           to: FIXED,
    //         },
    //         {
    //           label: "Flex Yield",
    //           to: FLEX,
    //         },
    //       ],
    //     },
    //     {
    //       icon: "iconoir:profile-circle",
    //       label: "Profile",
    //       to: PROFILE,
    //     },
    //   ],
    // },
    // {
    //   links: [
    //     {
    //       icon: "ep:chat-dot-round",
    //       label: "Support",
    //       onClick: toggleSupport,
    //       kycAllow: true,
    //     },
    //     // {
    //     //   icon: "la:cog",
    //     //   label: "Settings",
    //     //   to: SETTINGS,
    //     // },
    //     {
    //       icon: "ion:power-outline",
    //       label: "Logout",
    //       onClick: logout,
    //       kycAllow: true,
    //     },
    //   ],
    // },
  ];

  return (
    <>
      <Drawer
        open={sideNavigation.isOpen}
        variant={islg ? "permanent" : "temporary"}
        anchor={islg ? "left" : "right"}
        PaperProps={{
          rounded: "default",
          className: clsx(
            "flex flex-col border-r-0 w-[270px] bg-primary-darker text-primary-contrastText",
            islg ? "" : "bg-none"
          ),
        }}
        onClose={() => sideNavigation.toggle()}
      >
        <Toolbar className="flex items-center justify-between  mt-6">
          {islg && <Logo variant="1" />}
          {!islg && (
            <div className="flex gap-4">
              {" "}
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
              <div className=" border rounded-full w-10 h-10 border-neutral-100 ">
                <IconButton color="inherit" className="bg-neutral-50" disabled>
                  {/* <Badge badgeContent={7} color="error"> */}
                  <Iconify
                    className="MuiIcon-root text-[#292D32]"
                    icon="mdi:bell-outline"
                  />
                  {/* </Badge> */}
                </IconButton>
              </div>
            </div>
          )}
          {!islg && (
            <IconButton color="inherit" onClick={() => sideNavigation.toggle()}>
              <Icon>close</Icon>
            </IconButton>
          )}
        </Toolbar>
        <List className="p-4 md:p-6 flex-1 min-h-0 overflow-y-auto space-y-3">
          {NAV_LINKS.map(({ links }, index) => {
            return (
              <>
                {index ? (
                  <div className="py-10">
                    <Divider className="bg-white " />
                  </div>
                ) : null}
                {links.map((item, index) => {
                  return <AppProtectedDrawerItem key={index} item={item} />;
                })}
              </>
            );
          })}
        </List>
      </Drawer>

      <Dialog open={isSupport} maxWidth="xs" fullWidth>
        <DialogTitleXCloseButton
          onClose={() => {
            toggleSupport();
          }}
          // onClose={toggleSupport}
          className="text-center"
        >
          Customer Support
        </DialogTitleXCloseButton>
        <DialogContent>
          <div className="space-y-4 w-full max-w-lg mx-auto">
            {[
              {
                label: "Email Address",
                icon: "lucide:mail",
                href: "mailto:yieldsupport@creditdirect.ng",
                hrefText: "yieldsupport@creditdirect.ng",
              },
              {
                label: "Support Line 1",
                icon: "lucide:phone",
                href: "tel:02014482225",
                hrefText: "02014482225",
              },
              {
                label: "Support Line 2",
                icon: "lucide:phone",
                href: "tel:02017005120",
                hrefText: "02017005120",
              },
            ].map(({ icon, label, href, hrefText }) => {
              return (
                <Paper
                  key={label}
                  className="flex items-center gap-4 p-4 border-none"
                >
                  <Iconify className="text-lg" icon={icon} />
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      {label}
                    </Typography>
                    <MuiLink
                      className="text-[#4920AA]"
                      color="info"
                      href={href}
                    >
                      {hrefText}
                    </MuiLink>
                  </div>
                </Paper>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AppProtectedDrawer;

function AppProtectedDrawerItem(props: any) {
  const item = props.item;
  const { kycAllow, label, to, links, icon, onClick } = item;

  const [isKycDialog, toggleKycDialog] = useToggle();

  const authUser = useAuthUser();

  const isKycCompleted =
    authUser?.kyc_validation?.basic &&
    authUser?.kyc_validation?.nin &&
    authUser?.kyc_validation?.bank;

  const isGroup = !!links;

  const location = useLocation();

  const match = useMemo(() => {
    let result = null;
    const _links = isGroup ? links : [item];
    for (const link of _links) {
      result = matchPath({ path: link.to + "/*" }, location.pathname);
      if (result) {
        if (link?.toMatchExclude?.includes(result?.pathname)) {
          result = null;
        }
        break;
      }
    }
    return result;
  }, [isGroup, links, location.pathname, item]);

  const [isSubMenu, toggleSubMenu] = useToggle();

  return (
    <>
      <ListItemButton
        className={clsx(
          "rounded-lg flex gap-2 py-3 mb-2",
          !!match && "bg-[#285036] text-primary-contrastText"
        )}
        {...(isGroup
          ? { onClick: toggleSubMenu }
          : isKycCompleted || kycAllow
            ? onClick
              ? { onClick }
              : { component: Link, to }
            : { onClick: toggleKycDialog, disabled: true })}
      >
        <Iconify icon={icon} className="text-2xl" />
        <Typography className="font-medium flex-1">{label}</Typography>
        {isGroup && (
          <Iconify
            className="text-2xl"
            icon={isSubMenu ? "mingcute:up-line" : "mingcute:down-line"}
          />
        )}
      </ListItemButton>
      {isGroup && (
        <Collapse in={isSubMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {links?.map(({ label, to, toMatchExclude, ...rest }, index) => (
              <ListItemButton
                key={index}
                selected={
                  match?.pathnameBase === to &&
                  !toMatchExclude?.includes(match?.pathname)
                }
                className={clsx(
                  "pl-12 rounded-lg py-3 mb-2",
                  match?.pathnameBase === to &&
                    !toMatchExclude?.includes(match?.pathname) &&
                    "bg-[#285036] text-primary-contrastText"
                )}
                component={Link}
                to={to}
                {...rest}
              >
                <Typography className="font-medium">{label}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}

      <Dialog open={isKycDialog} fullWidth onClose={toggleKycDialog}>
        <DialogContent>
          <div className="flex flex-col gap-4 items-center">
            <Icon color="warning" className="text-8xl">
              sentiment_satisfied
            </Icon>
            <Typography className="text-center text-text-secondary">
              Your KYC information is incomplete please update your profile to
              yield and perform other actions.
            </Typography>
            <Button
              // component={Link}
              // to={DASHBOARD_KYC}
              onClick={toggleKycDialog as any}
              className="mt-4"
            >
              Update profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
