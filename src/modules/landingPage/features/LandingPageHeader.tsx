import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "components/Logo";
import { Link } from "react-router-dom";

interface Props {
  window?: () => Window;
}

const drawerWidth = 300;

const navItems = [
  {
    href: "#products",
    displayText: "Products",
  },
  {
    href: "#about-us",
    displayText: "About us",
  },
];

export default function LandingPageHeader(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      className="text-center bg-custom-gradient h-full"
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        <Logo variant="1" />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item.displayText} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <header className="inset-x-0 top-0 z-50 sm:sticky">
      <CssBaseline />
      <div className=" bg-header-gradient">
        <Toolbar className="p-0">
          <div className="flex flex-wrap justify-between items-center mx-auto px-4 py-6 container lg:px-2">
            <Link to="/">
              <Logo variant="1" />
            </Link>

            <IconButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              className="text-primary-main block lg:hidden"
            >
              <Iconify
                fontSize={35}
                icon="material-symbols:menu-rounded"
                className="cursor-pointer text-primary-main"
              />
            </IconButton>

            <Box className="hidden lg:flex items-center ml-auto gap-15">
              <div className="flex gap-9">
                {navItems.map((item) => (
                  <Link
                    to={item.href}
                    key={item.displayText}
                    className="font-semibold "
                  >
                    {item.displayText}
                  </Link>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  href="/signin"
                  variant="outlined"
                  size="large"
                  className=" text-neutral-800 border-neutral-300 hover:border-neutral-900 font-semibold"
                >
                  Sign In
                </Button>
                <Button
                  href="/signup"
                  variant="gradient"
                  size="large"
                  className="font-semibold "
                >
                  Create business account
                </Button>
              </div>
            </Box>
          </div>
        </Toolbar>
      </div>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </header>
  );
}
