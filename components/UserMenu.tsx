"use client";

import { Avatar, Box, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function UserMenu({ name }: { name: string }) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <Box>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar sx={{ bgcolor: "white", color: "black" }}>{name?.charAt(0)}</Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-user"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Link href="/dashboard" color="inherit" underline="none">
          <MenuItem>Dashboard</MenuItem>
        </Link>

        <MenuItem onClick={() => signOut()}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
