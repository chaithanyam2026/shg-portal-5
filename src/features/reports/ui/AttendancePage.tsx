"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Divider, Stack, Typography } from "@mui/material";

import type { FinancialYearOption } from "@/features/financial-year/domain/financial-year-option";

import FinancialYearSelector from "@/features/financial-year/ui/FinancialYearSelector";

import type { AttendanceFineRegister } from "../domain/attendance-fine-register";
import type { AttendanceRegister } from "../domain";

import AttendanceFineRegisterTable from "./AttendanceFineRegisterTable";
import AttendanceRegisterTable from "./AttendanceRegisterTable";

type Props = {
  financialYearId: string;

  options: FinancialYearOption[];

  register: AttendanceRegister;

  fineRegister: AttendanceFineRegister;
};

export default function AttendancePage({
  financialYearId,
  options,
  register,
  fineRegister,
}: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleFinancialYearChange(id: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("financialYear", id);

    router.push(`/attendance?${params.toString()}`);
  }

  return (
    <Stack spacing={4}>
      <FinancialYearSelector
        value={financialYearId}
        options={options}
        onChange={handleFinancialYearChange}
      />

      <Stack spacing={2}>
        <Typography variant="h6">Attendance Register</Typography>

        <Typography variant="body2" color="text.secondary">
          Members are listed vertically and meetings horizontally. Hover an icon for details.
        </Typography>

        <AttendanceRegisterTable register={register} />
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Typography variant="h6">Absent Fine List</Typography>

        <Typography variant="body2" color="text.secondary">
          Fine totals generated from absences, payments collected, and outstanding balance per
          member.
        </Typography>

        <AttendanceFineRegisterTable register={fineRegister} />
      </Stack>
    </Stack>
  );
}
