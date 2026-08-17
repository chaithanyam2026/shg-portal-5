import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import { ADMIN_ROLES, FINANCIAL_STEWARD_ROLES, type UserRole } from "@/lib/auth/roles";

import type { NavigationItem } from "./navigation-types";

export type DashboardNavLink = {
  title: string;
  href: string;
};

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
    roles: FINANCIAL_STEWARD_ROLES,
    allowOfficeBearers: true,
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
    roles: FINANCIAL_STEWARD_ROLES,
    allowOfficeBearers: true,
  },

  {
    title: "My Profile",
    href: "/account/profile",
    icon: PersonOutlinedIcon,
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
    roles: ADMIN_ROLES,
  },
];

export function filterNavigationByRole(
  items: NavigationItem[],
  role: UserRole | string,
  options?: {
    isOfficeBearer?: boolean;
  },
): NavigationItem[] {
  return items.filter((item) => {
    if (!item.roles) {
      return true;
    }

    if (item.roles.includes(role as UserRole)) {
      return true;
    }

    return Boolean(item.allowOfficeBearers && options?.isOfficeBearer);
  });
}

export function getDashboardNavLinks(
  role: UserRole | string,
  isOfficeBearer = false,
): DashboardNavLink[] {
  return filterNavigationByRole(dashboardNavigation, role, { isOfficeBearer }).map(
    ({ title, href }) => ({
      title,
      href,
    }),
  );
}
