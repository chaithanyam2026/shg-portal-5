import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import type { UserRole } from "@/lib/auth/roles";

import type { NavigationItem } from "./navigation-types";

export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: DashboardOutlinedIcon,
  },

  {
    title: "Meetings",
    href: "/meetings",
    icon: EventOutlinedIcon,
  },

  {
    title: "Loans",
    href: "/loans",
    icon: AccountBalanceWalletOutlinedIcon,
  },

  {
    title: "Attendance",
    href: "/attendance",
    icon: AssessmentOutlinedIcon,
  },

  {
    title: "Financial Years",
    href: "/financial-years",
    icon: CalendarMonthOutlinedIcon,
  },

  {
    title: "Members",
    href: "/members",
    icon: GroupsOutlinedIcon,
  },

  {
    title: "Reports",
    href: "/reports",
    icon: BarChartOutlinedIcon,
    // roles: ["ADMIN", "TREASURER"],
  },

  {
    title: "Change Password",
    href: "/account/change-password",
    icon: LockOutlinedIcon,
  },

  {
    title: "Users",
    href: "/settings/users",
    icon: SettingsOutlinedIcon,
    roles: ["ADMIN"],
  },
];

export function filterNavigationByRole(
  items: NavigationItem[],
  role: UserRole | string,
): NavigationItem[] {
  return items.filter((item) => !item.roles || item.roles.includes(role as UserRole));
}
