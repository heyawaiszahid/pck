"use client";

import { modules } from "@/config";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { signOut } from "next-auth/react";
import { useState } from "react";
import ListItem from "./ListItem";
import ModeSwitcher from "./ModeSwitcher";

const drawerWidth: number = 280;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function AppBarDrawer({ role }: { role?: string }) {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  const slug = role === "SUPERADMIN" ? "/settings/company" : "/settings";

  return (
    <>
      <AppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: "24px" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography component="h1" variant="h6" sx={{ flexGrow: 1 }}>
            Pipeline Conversion Kit
          </Typography>

          <ModeSwitcher />

          {role !== "SUPERADMIN" && (
            <IconButton color="inherit" component={Link} href="/">
              <HomeIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", px: [1] }}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>

        <Divider />

        <List component="nav">
          <ListItem title="Dashboard" href="/dashboard" icon="Dashboard"></ListItem>

          {role === "ADMIN" && <ListItem title="Members" href="/dashboard/members" icon="Group"></ListItem>}

          {role === "SUPERADMIN" && (
            <ListItem title="Companies" href="/dashboard/companies" icon="TableRows"></ListItem>
          )}

          <Divider sx={{ my: 1 }} />

          {modules.map((module, index) => {
            const { title, isActive, excludeFromDashboard } = module;
            const href = title.toLowerCase().replaceAll(" ", "-");
            return (
              !excludeFromDashboard && (
                <ListItem
                  key={index}
                  title={title}
                  href={`/dashboard${slug}/${href}`}
                  icon="Settings"
                  disabled={isActive === false}
                />
              )
            );
          })}

          <Divider sx={{ my: 1 }} />

          {role !== "SUPERADMIN" && <ListItem title="Profile" href="/dashboard/profile" icon="Person"></ListItem>}

          <ListItem title="Logout" onClick={() => signOut()} icon="Logout"></ListItem>
        </List>
      </Drawer>
    </>
  );
}
