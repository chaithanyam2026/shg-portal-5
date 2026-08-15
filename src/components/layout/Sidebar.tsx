"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";

import { dashboardNavigation, filterNavigationByRole } from "@/lib/navigation";

export const DRAWER_WIDTH = 260;

type Props = {
  mobileOpen?: boolean;

  onClose?: () => void;

  mobile?: boolean;

  userRole?: string;
};

export default function Sidebar({
  mobile = false,
  mobileOpen = false,
  onClose,
  userRole = "MEMBER",
}: Props) {
  const pathname = usePathname();
  const navigation = filterNavigationByRole(dashboardNavigation, userRole);

  return (
    <Drawer
      variant={mobile ? "temporary" : "permanent"}
      open={mobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: DRAWER_WIDTH,

        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,

          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {navigation.map((item) => {
          const Icon = item.icon;

          const selected =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={onClose}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>

              <ListItemText primary={item.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
