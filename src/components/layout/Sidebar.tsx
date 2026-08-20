"use client";

import Link from "next/link";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { usePathname } from "next/navigation";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";

import type { DashboardNavLink } from "@/lib/navigation";

export const DRAWER_WIDTH = 260;
export const COLLAPSED_DRAWER_WIDTH = 72;

const NAV_ICONS: Record<string, typeof DashboardOutlinedIcon> = {
  "/": DashboardOutlinedIcon,
  "/meetings": EventOutlinedIcon,
  "/loans": AccountBalanceWalletOutlinedIcon,
  "/attendance": AssessmentOutlinedIcon,
  "/chitty": PaymentsOutlinedIcon,
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function Sidebar({
  navItems,
  mobile = false,
  mobileOpen = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: Props) {
  const pathname = usePathname();
  const isCollapsed = !mobile && collapsed;
  const drawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant={mobile ? "temporary" : "permanent"}
      open={mobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        display: mobile ? undefined : { xs: "none", md: "block" },
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <Toolbar />

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const Icon = NAV_ICONS[item.href] ?? DashboardOutlinedIcon;
          const selected =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Tooltip key={item.href} title={isCollapsed ? item.title : ""} placement="right">
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                onClick={onClose}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? "center" : "initial",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 3,
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {!mobile && onToggleCollapse && (
        <Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-end", p: 1 }}>
            <Tooltip
              title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
              placement="right"
            >
              <IconButton
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                size="small"
              >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
