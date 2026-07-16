"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import AttendanceRegisterTable
  from "./AttendanceRegisterTable";
  import {
  Button,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

import type {
  AttendanceRegister,
} from "../domain";

type Props = {
  financialYearId: string;
};

export default function AttendanceRegister({
  financialYearId,
}: Props) {
  const [
    register,
    setRegister,
  ] = useState<
    AttendanceRegister | undefined
  >();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            `/api/financial-years/${financialYearId}/attendance-register`,
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message,
          );
        }

        setRegister(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load register.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [financialYearId]);

  if (loading) {
    return (
      <Stack
        alignItems="center"
        py={6}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!register) {
    return (
      <Alert severity="info">
        Attendance register
        unavailable.
      </Alert>
    );
  }

  return (
    <><Button
  variant="contained"
  startIcon={<PrintIcon />}
  onClick={() =>
    window.print()
  }
>
  Print Register
</Button>
    <AttendanceRegisterTable
      register={register}
    />
    </>
  );
}