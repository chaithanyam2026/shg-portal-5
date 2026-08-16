"use client";

import Link from "next/link";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { usePathname } from "next/navigation";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";

import type { DashboardNavLink } from "@/lib/navigation";

export const DRAWER_WIDTH = 260;

const NAV_ICONS: Record<string, typeof DashboardOutlinedIcon> = {
  "/": DashboardOutlinedIcon,
  "/meetings": EventOutlinedIcon,
  "/loans": AccountBalanceWalletOutlinedIcon,
  "/attendance": AssessmentOutlinedIcon,
  "/financial-years": CalendarMonthOutlinedIcon,
  "/members": GroupsOutlinedIcon,
  "/reports": BarChartOutlinedIcon,
  "/account/profile": PersonOutlinedIcon,
  "/account/change-password": LockOutlinedIcon,
  "/settings/users": SettingsOutlinedIcon,
};

type Props = {
  navItems: DashboardNavLink[];
  mobileOpen?: boolean;
  onClose?: () => void;
  mobile?: boolean;
};

export default function Sidebar({
  navItems,
  mobile = false,
  mobileOpen = false,
  onClose,
}: Props) {
  const pathname = usePathname();

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

        display: mobile ? undefined : { xs: "none", md: "block" },

        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,

          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {navItems.map((item) => {
          const Icon = NAV_ICONS[item.href] ?? DashboardOutlinedIcon;

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
