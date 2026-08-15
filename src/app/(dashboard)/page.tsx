import Link from "next/link";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";

import PageHeader from "@/components/layout/PageHeader";
import { auth } from "@/auth";
import type { UserRole } from "@/lib/auth/roles";

type DashboardModule = {
  title: string;
  description: string;
  href: string;
  icon: typeof EventOutlinedIcon;
  roles?: readonly UserRole[];
};

const modules: DashboardModule[] = [
  {
    title: "Meetings",
    description: "Conduct meetings and record attendance, payments, and expenses.",
    href: "/meetings",
    icon: EventOutlinedIcon,
  },
  {
    title: "Loans",
    description: "Manage member loans and repayments.",
    href: "/loans",
    icon: AccountBalanceWalletOutlinedIcon,
  },
  {
    title: "Attendance",
    description: "Review attendance registers and fine summaries.",
    href: "/attendance",
    icon: AssessmentOutlinedIcon,
  },
  {
    title: "Financial Years",
    description: "Manage financial years and opening balances.",
    href: "/financial-years",
    icon: CalendarMonthOutlinedIcon,
  },
  {
    title: "Members",
    description: "Manage SHG members and passbooks.",
    href: "/members",
    icon: GroupsOutlinedIcon,
  },
  {
    title: "Reports",
    description: "Attendance, loan, income, and member financial reports.",
    href: "/reports",
    icon: BarChartOutlinedIcon,
    roles: ["ADMIN", "TREASURER"],
  },
];

function canAccessModule(role: UserRole, module: DashboardModule): boolean {
  if (!module.roles) {
    return true;
  }

  return module.roles.includes(role);
}

export default async function DashboardPage() {
  const session = await auth();
  const role = (session?.user.role as UserRole | undefined) ?? "MEMBER";
  const visibleModules = modules.filter((module) => canAccessModule(role, module));

  return (
    <Stack spacing={3}>
      <PageHeader title="Dashboard" showBack={false} subtitle="Self Help Group Management System" />

      <Grid container spacing={2}>
        {visibleModules.map((module) => {
          const Icon = module.icon;

          return (
            <Grid
              key={module.href}
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                }}
              >
                <Link href={module.href} style={{ textDecoration: "none", color: "inherit" }}>
                  <CardActionArea
                    sx={{
                      height: "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 1.5,
                        py: 3,
                        px: 2,
                        minHeight: 180,
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 40,
                        }}
                        color="primary"
                      />

                      <Typography variant="h6">{module.title}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {module.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
