import Link from "next/link";

import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import PageHeader from "@/components/layout/PageHeader";

const modules = [
  {
    title: "Financial Years",
    description:
      "Manage financial years and opening balances.",
    href: "/financial-years",
    icon: CalendarMonthOutlinedIcon,
  },
  {
    title: "Members",
    description:
      "Manage SHG members and passbooks.",
    href: "/members",
    icon: GroupsOutlinedIcon,
  },
  {
    title: "Meetings",
    description:
      "Conduct meetings and record attendance, payments, and expenses.",
    href: "/meetings",
    icon: EventOutlinedIcon,
  },
  {
    title: "Loans",
    description:
      "Manage member loans and repayments.",
    href: "/loans",
    icon:
      AccountBalanceWalletOutlinedIcon,
  },
  {
    title: "Reports",
    description:
      "Attendance, contribution, loan, and financial reports.",
    href: "/reports",
    icon:
      AssessmentOutlinedIcon,
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        showBack={false}
        subtitle="Self Help Group Management System"
      />

      <Grid
        container
        spacing={3}
      >
        {modules.map(
          (module) => {
            const Icon =
              module.icon;

            return (
              <Grid
                key={
                  module.href
                }
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={
                      module.href
                    }
                    sx={{
                      height:
                        "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                        textAlign:
                          "center",
                        gap: 2,
                        py: 4,
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 48,
                        }}
                        color="primary"
                      />

                      <Typography
                        variant="h6"
                      >
                        {
                          module.title
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          module.description
                        }
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          },
        )}
      </Grid>
    </>
  );
}