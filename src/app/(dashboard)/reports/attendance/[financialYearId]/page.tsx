import Link from "next/link";

import {
  Button,
  Grid,
} from "@mui/material";

import {
  buildAttendanceRegister,
} from "@/features/reports/services/build-attendance-register";

import AttendanceRegisterTable
  from "@/features/reports/ui/AttendanceRegisterTable";

import PageHeader
  from "@/components/layout/PageHeader";

type Props = {
  params: Promise<{
    financialYearId: string;
  }>;
};

export default async function AttendanceRegisterPage({
  params,
}: Props) {
  const {
    financialYearId,
  } = await params;

  const register =
    await buildAttendanceRegister(
      financialYearId,
    );

  return (
    <>
      <PageHeader
        title="Attendance Register"
        backHref="/reports"
      />

      <AttendanceRegisterTable
        register={
          register
        }
      />

      <Grid
        container
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Link href={`/reports/attendance/${financialYearId}`}>
          <Button
            
            variant="contained"
            fullWidth
          >
            Attendance Register
          </Button>
          </Link>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Link  href={`/reports/attendance-fines/${financialYearId}`}>
          <Button
            variant="contained"
            fullWidth
          >
            Attendance Fine Register
          </Button>
          </Link>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Link href={`/reports/attendance-fine-defaulters/${financialYearId}`}>
          <Button
            variant="contained"
            fullWidth
          >
            Attendance Fine Defaulters
          </Button>
          </Link>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Link   href={`/reports/attendance-fine-collection/${financialYearId}`}>
          <Button
          
            variant="contained"
            fullWidth
          >
            Attendance Fine Collection
          </Button>
          </Link>
        </Grid>
      </Grid>

    </>
  );
}