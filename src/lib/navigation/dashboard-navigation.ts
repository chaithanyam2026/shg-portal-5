import DashboardOutlinedIcon
  from "@mui/icons-material/DashboardOutlined";

import CalendarMonthOutlinedIcon
  from "@mui/icons-material/CalendarMonthOutlined";

import GroupsOutlinedIcon
  from "@mui/icons-material/GroupsOutlined";

import EventOutlinedIcon
  from "@mui/icons-material/EventOutlined";

import AccountBalanceWalletOutlinedIcon
  from "@mui/icons-material/AccountBalanceWalletOutlined";

import AssessmentOutlinedIcon
  from "@mui/icons-material/AssessmentOutlined";

import type {
  NavigationItem,
} from "./navigation-types";

export const dashboardNavigation: NavigationItem[] =
  [
    {
      title: "Dashboard",
      href: "/",
      icon:
        DashboardOutlinedIcon,
    },

    {
      title:
        "Financial Years",
      href:
        "/financial-years",
      icon:
        CalendarMonthOutlinedIcon,
    },

    {
      title: "Members",
      href: "/members",
      icon:
        GroupsOutlinedIcon,
    },

    {
      title: "Meetings",
      href: "/meetings",
      icon:
        EventOutlinedIcon,
    },

    {
      title: "Loans",
      href: "/loans",
      icon:
        AccountBalanceWalletOutlinedIcon,
    },

    {
      title: "Reports",
      href: "/reports",
      icon:
        AssessmentOutlinedIcon,
    },
  ];